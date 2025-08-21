import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminActionRequest {
  action: 'approve_ewaste' | 'reject_ewaste' | 'update_user_role' | 'delete_user' | 'create_campaign';
  targetId: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Set the auth context
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      throw new Error("Insufficient permissions");
    }

    const { action, targetId, data }: AdminActionRequest = await req.json();

    let result;

    switch (action) {
      case 'approve_ewaste':
        result = await supabase
          .from('ewaste_items')
          .update({ 
            status: 'approved',
            collection_date: new Date().toISOString()
          })
          .eq('id', targetId);

        // Award carbon credits
        if (!result.error) {
          const creditAmount = data?.creditAmount || 10;
          await supabase
            .from('carbon_credits')
            .insert({
              user_id: data.userId,
              ewaste_item_id: targetId,
              credits_earned: creditAmount,
              transaction_type: 'earned',
              description: `E-waste item approved: ${data.itemName}`
            });

          // Send notification
          await supabase.functions.invoke('send-notification', {
            body: {
              userId: data.userId,
              title: 'E-waste Item Approved!',
              message: `Your ${data.itemName} has been approved and you earned ${creditAmount} carbon credits.`,
              type: 'success',
              sendEmail: true
            }
          });
        }
        break;

      case 'reject_ewaste':
        result = await supabase
          .from('ewaste_items')
          .update({ 
            status: 'rejected',
            description: data?.reason || 'Item rejected by admin'
          })
          .eq('id', targetId);

        if (!result.error) {
          await supabase.functions.invoke('send-notification', {
            body: {
              userId: data.userId,
              title: 'E-waste Item Rejected',
              message: `Your ${data.itemName} has been rejected. Reason: ${data?.reason || 'Not specified'}`,
              type: 'warning',
              sendEmail: true
            }
          });
        }
        break;

      case 'update_user_role':
        result = await supabase
          .from('profiles')
          .update({ role: data.newRole })
          .eq('user_id', targetId);
        break;

      case 'create_campaign':
        result = await supabase
          .from('campaigns')
          .insert({
            title: data.title,
            description: data.description,
            target_amount: data.targetAmount,
            start_date: data.startDate,
            end_date: data.endDate,
            image_url: data.imageUrl,
            created_by: user.id
          });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: action,
        target_table: getTableFromAction(action),
        target_id: targetId,
        new_values: data
      });

    if (result.error) throw result.error;

    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in admin-actions function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getTableFromAction(action: string): string {
  switch (action) {
    case 'approve_ewaste':
    case 'reject_ewaste':
      return 'ewaste_items';
    case 'update_user_role':
      return 'profiles';
    case 'create_campaign':
      return 'campaigns';
    default:
      return 'unknown';
  }
}

serve(handler);