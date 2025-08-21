import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  sendEmail?: boolean;
  actionUrl?: string;
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

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { userId, title, message, type, sendEmail, actionUrl }: NotificationRequest = await req.json();

    // Insert notification into database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl
      });

    if (notifError) throw notifError;

    // Send email notification if requested
    if (sendEmail) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, display_name, email_notifications')
        .eq('user_id', userId)
        .single();

      if (!profileError && profile?.email_notifications) {
        await resend.emails.send({
          from: "EcoTrace <notifications@resend.dev>",
          to: [profile.email],
          subject: `EcoTrace: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00ff88;">${title}</h2>
              <p>${message}</p>
              ${actionUrl ? `<a href="${actionUrl}" style="background: #00ff88; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Take Action</a>` : ''}
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">
                This email was sent by EcoTrace. To unsubscribe from notifications, update your preferences in your profile.
              </p>
            </div>
          `,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);