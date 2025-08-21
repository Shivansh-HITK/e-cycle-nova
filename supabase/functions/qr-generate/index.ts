import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  itemId: string;
  purpose: 'view' | 'handoff' | 'pickup' | 'process';
  expiresMinutes?: number;
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

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No authorization header");

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const { itemId, purpose, expiresMinutes }: GenerateRequest = await req.json();

    // Permission: owner or admin
    const { data: isOwner } = await supabase
      .from('ewaste_items')
      .select('id')
      .eq('id', itemId)
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const isAdmin = profile?.role === 'admin';
    if (!isOwner && !isAdmin) throw new Error('Forbidden');

    const { data: tokenData, error: tokenError } = await supabase.rpc('create_qr_token', {
      p_item_id: itemId,
      p_purpose: purpose,
      p_expires_minutes: expiresMinutes ?? 60
    });

    if (tokenError) throw tokenError;

    // Return token and QR payload url (frontend can render QR image)
    const qrUrl = `${Deno.env.get('PUBLIC_APP_URL') || ''}/qr/scan?token=${tokenData}`;

    return new Response(
      JSON.stringify({ token: tokenData, url: qrUrl }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('qr-generate error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

