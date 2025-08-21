import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScanRequest {
  token: string;
  event?: 'pickup_started' | 'collected' | 'in_transit' | 'arrived_facility' | 'processed' | 'handoff';
  lat?: number;
  lng?: number;
  notes?: string;
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

    // Auth is optional for viewing, required for mutating
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = user?.id ?? null;
    }

    const { token, event, lat, lng, notes }: ScanRequest = await req.json();

    const { data: qr, error: qrErr } = await supabase
      .from('qr_tokens')
      .select('id, item_id, purpose, expires_at, used')
      .eq('token', token)
      .maybeSingle();
    if (qrErr || !qr) throw new Error('Invalid token');
    if (qr.used) throw new Error('Token already used');
    if (qr.expires_at && new Date(qr.expires_at) < new Date()) throw new Error('Token expired');

    // Always return item basic data
    const { data: item, error: itemErr } = await supabase
      .from('ewaste_items')
      .select('id, item_name, status, user_id, pickup_location, qr_code, category, brand, model')
      .eq('id', qr.item_id)
      .single();
    if (itemErr) throw itemErr;

    // If event provided, require auth and record event
    if (event) {
      if (!userId) throw new Error('Unauthorized');

      const { data: ev, error: evErr } = await supabase.rpc('record_tracking_event', {
        p_item_id: qr.item_id,
        p_event: event,
        p_lat: lat ?? null,
        p_lng: lng ?? null,
        p_notes: notes ?? null,
        p_meta: { source: 'qr-scan', token_id: qr.id }
      });
      if (evErr) throw evErr;

      // Optionally mark token as used for one-time purposes (handoff/process)
      if (qr.purpose === 'handoff' || qr.purpose === 'process') {
        await supabase.from('qr_tokens').update({ used: true }).eq('id', qr.id);
      }

      return new Response(
        JSON.stringify({ item, event: ev }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // No mutation: just return item details for viewing
    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('qr-scan error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

