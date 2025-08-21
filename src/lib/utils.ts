import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Backend helpers
export const qrFunction = {
  generate: async (supabase: any, params: { itemId: string; purpose: 'view'|'handoff'|'pickup'|'process'; expiresMinutes?: number }) => {
    const { data, error } = await supabase.functions.invoke('qr-generate', { body: params });
    if (error) throw error;
    return data as { token: string; url: string };
  },
  scan: async (supabase: any, params: { token: string; event?: 'pickup_started'|'collected'|'in_transit'|'arrived_facility'|'processed'|'handoff'; lat?: number; lng?: number; notes?: string }) => {
    const { data, error } = await supabase.functions.invoke('qr-scan', { body: params });
    if (error) throw error;
    return data as any;
  }
};

export const tracking = {
  assignItem: async (supabase: any, args: { itemId: string; driverUserId?: string; orgId?: string }) => {
    const { data, error } = await supabase.rpc('assign_item', {
      p_item_id: args.itemId,
      p_driver_user_id: args.driverUserId ?? null,
      p_org_id: args.orgId ?? null
    });
    if (error) throw error;
    return data;
  },
  recordEvent: async (supabase: any, args: { itemId: string; event: 'pickup_started'|'collected'|'in_transit'|'arrived_facility'|'processed'|'handoff'|'approved'|'rejected'; lat?: number; lng?: number; notes?: string; meta?: any }) => {
    const { data, error } = await supabase.rpc('record_tracking_event', {
      p_item_id: args.itemId,
      p_event: args.event,
      p_lat: args.lat ?? null,
      p_lng: args.lng ?? null,
      p_notes: args.notes ?? null,
      p_meta: args.meta ?? null
    });
    if (error) throw error;
    return data;
  }
}
