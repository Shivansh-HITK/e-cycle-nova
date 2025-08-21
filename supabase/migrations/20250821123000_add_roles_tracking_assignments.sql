-- Extend roles, add organizations, assignments, tracking events, and QR tokens

-- Create role and event enums
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('individual','ngo','driver','recycler','admin','moderator');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.tracking_event_type AS ENUM (
    'created','assigned','pickup_started','collected','in_transit','arrived_facility','processed','handoff','cancelled','approved','rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Migrate profiles.role (text) to enum user_role, mapping legacy values
ALTER TABLE public.profiles
  ALTER COLUMN role TYPE public.user_role USING (
    CASE role
      WHEN 'user' THEN 'individual'
      WHEN 'admin' THEN 'admin'
      WHEN 'moderator' THEN 'moderator'
      ELSE 'individual'
    END::public.user_role
  );

-- Ensure ewaste_items.status supports all lifecycle states (includes rejected used by admin function)
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT con.conname INTO constraint_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'ewaste_items' AND con.contype = 'c' AND con.conname LIKE 'ewaste_items_%_check';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.ewaste_items DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.ewaste_items
  ADD CONSTRAINT ewaste_items_status_check CHECK (
    status IN ('pending','approved','collected','processed','completed','rejected','assigned','in_transit','arrived_facility')
  );

-- Organizations (for NGOs/recyclers) and membership
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('ngo','recycler','government','company')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_role TEXT NOT NULL CHECK (org_role IN ('owner','admin','member','driver')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);

-- Optional driver profile details
CREATE TABLE IF NOT EXISTS public.driver_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT,
  vehicle_plate TEXT,
  vehicle_type TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assignments of items to drivers or organizations
CREATE TABLE IF NOT EXISTS public.ewaste_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.ewaste_items(id) ON DELETE CASCADE,
  assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','accepted','rejected','cancelled','completed')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Ensure only one active/pending assignment per item
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_assignment_per_item
ON public.ewaste_assignments (item_id)
WHERE status IN ('pending','active');

-- Tracking events for chain-of-custody
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.ewaste_items(id) ON DELETE CASCADE,
  event_type public.tracking_event_type NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  notes TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- QR tokens for secure scanning flows
CREATE TABLE IF NOT EXISTS public.qr_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.ewaste_items(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('view','handoff','pickup','process')),
  expires_at TIMESTAMPTZ,
  used BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewaste_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_tokens ENABLE ROW LEVEL SECURITY;

-- Organizations: members can view, owners/admins manage; admins can view all
CREATE POLICY org_select_members ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.org_id = organizations.id AND m.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY org_manage_owners ON public.organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.org_id = organizations.id AND m.user_id = auth.uid() AND m.org_role IN ('owner','admin')
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Organization members: user can view their membership; owners/admins manage
CREATE POLICY org_members_select_self ON public.organization_members
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'));

CREATE POLICY org_members_manage_owners ON public.organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members m2
      WHERE m2.org_id = organization_members.org_id AND m2.user_id = auth.uid() AND m2.org_role IN ('owner','admin')
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Driver profiles: drivers and admins can view, drivers update self
CREATE POLICY driver_profiles_select_self ON public.driver_profiles
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'));

CREATE POLICY driver_profiles_update_self ON public.driver_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY driver_profiles_insert_self ON public.driver_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Assignments: item owner, assigned user/org members, and admins can view; owners/admins/ngo admins can insert/manage
CREATE POLICY assignments_select_related ON public.ewaste_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ewaste_items e WHERE e.id = ewaste_assignments.item_id AND e.user_id = auth.uid())
    OR assigned_to_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.org_id = ewaste_assignments.assigned_to_org_id AND m.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY assignments_insert_manage ON public.ewaste_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.org_id = ewaste_assignments.assigned_to_org_id AND m.user_id = auth.uid() AND m.org_role IN ('owner','admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.ewaste_items e WHERE e.id = ewaste_assignments.item_id AND e.user_id = auth.uid()
    )
  );

-- Tracking events: related actors can write; related users can read
CREATE POLICY tracking_events_select_related ON public.tracking_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ewaste_items e WHERE e.id = tracking_events.item_id AND e.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.ewaste_assignments a WHERE a.item_id = tracking_events.item_id AND (a.assigned_to_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.org_id = a.assigned_to_org_id AND m.user_id = auth.uid())))
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY tracking_events_insert_related ON public.tracking_events
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ewaste_items e WHERE e.id = tracking_events.item_id AND e.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.ewaste_assignments a WHERE a.item_id = tracking_events.item_id AND (a.assigned_to_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.org_id = a.assigned_to_org_id AND m.user_id = auth.uid())))
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
  );

-- QR tokens: creators, related users, and admins can view; creators insert
CREATE POLICY qr_tokens_select_related ON public.qr_tokens
  FOR SELECT USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.ewaste_items e WHERE e.id = qr_tokens.item_id AND e.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY qr_tokens_insert_creator ON public.qr_tokens
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- RPC: record tracking event and update item status with permission checks
CREATE OR REPLACE FUNCTION public.record_tracking_event(
  p_item_id UUID,
  p_event public.tracking_event_type,
  p_lat NUMERIC,
  p_lng NUMERIC,
  p_notes TEXT DEFAULT NULL,
  p_meta JSONB DEFAULT '{}'::jsonb
)
RETURNS public.tracking_events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_is_admin BOOLEAN;
  v_is_owner BOOLEAN;
  v_is_driver BOOLEAN;
  v_org_id UUID;
  v_event public.tracking_event_type := p_event;
  v_new_status TEXT;
  v_event_row public.tracking_events;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = v_uid AND role = 'admin') INTO v_is_admin;
  SELECT EXISTS (SELECT 1 FROM public.ewaste_items WHERE id = p_item_id AND user_id = v_uid) INTO v_is_owner;
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = v_uid AND role = 'driver') INTO v_is_driver;

  IF NOT (v_is_admin OR v_is_owner OR v_is_driver OR EXISTS (
    SELECT 1 FROM public.ewaste_assignments a
    LEFT JOIN public.organization_members m ON m.org_id = a.assigned_to_org_id AND m.user_id = v_uid
    WHERE a.item_id = p_item_id AND (a.assigned_to_user_id = v_uid OR m.user_id IS NOT NULL)
  )) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  -- Map item status transitions
  v_new_status := CASE v_event
    WHEN 'assigned' THEN 'assigned'
    WHEN 'pickup_started' THEN 'assigned'
    WHEN 'collected' THEN 'collected'
    WHEN 'in_transit' THEN 'in_transit'
    WHEN 'arrived_facility' THEN 'in_transit'
    WHEN 'processed' THEN 'processed'
    WHEN 'handoff' THEN 'completed'
    WHEN 'approved' THEN 'approved'
    WHEN 'rejected' THEN 'rejected'
    ELSE NULL
  END;

  INSERT INTO public.tracking_events (item_id, event_type, actor_user_id, actor_org_id, latitude, longitude, notes, meta)
  VALUES (
    p_item_id, v_event, v_uid, v_org_id, p_lat, p_lng, p_notes, p_meta
  )
  RETURNING * INTO v_event_row;

  IF v_new_status IS NOT NULL THEN
    UPDATE public.ewaste_items SET status = v_new_status, updated_at = now()
    WHERE id = p_item_id;
  END IF;

  RETURN v_event_row;
END;
$$;

-- RPC: assign item to driver or org and update item status
CREATE OR REPLACE FUNCTION public.assign_item(
  p_item_id UUID,
  p_driver_user_id UUID DEFAULT NULL,
  p_org_id UUID DEFAULT NULL
)
RETURNS public.ewaste_assignments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_is_admin BOOLEAN;
  v_is_org_admin BOOLEAN;
  v_row public.ewaste_assignments;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = v_uid AND role = 'admin') INTO v_is_admin;

  IF p_org_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.organization_members WHERE org_id = p_org_id AND user_id = v_uid AND org_role IN ('owner','admin')
    ) INTO v_is_org_admin;
  ELSE
    v_is_org_admin := false;
  END IF;

  IF NOT (v_is_admin OR v_is_org_admin) THEN
    -- allow owner of the item to assign as well
    IF NOT EXISTS (SELECT 1 FROM public.ewaste_items WHERE id = p_item_id AND user_id = v_uid) THEN
      RAISE EXCEPTION 'Forbidden';
    END IF;
  END IF;

  INSERT INTO public.ewaste_assignments (item_id, assigned_to_user_id, assigned_to_org_id, assigned_by, status)
  VALUES (p_item_id, p_driver_user_id, p_org_id, v_uid, 'active')
  RETURNING * INTO v_row;

  UPDATE public.ewaste_items SET status = 'assigned', updated_at = now() WHERE id = p_item_id;
  PERFORM public.record_tracking_event(p_item_id, 'assigned', NULL, NULL, 'Item assigned', '{"source":"assign_item"}');

  RETURN v_row;
END;
$$;

-- RPC: create QR token for an item
CREATE OR REPLACE FUNCTION public.create_qr_token(
  p_item_id UUID,
  p_purpose TEXT,
  p_expires_minutes INT DEFAULT 60
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_token TEXT := encode(gen_random_bytes(24), 'hex');
  v_expires TIMESTAMPTZ := now() + make_interval(mins => p_expires_minutes);
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.ewaste_items e
    WHERE e.id = p_item_id AND (e.user_id = v_uid OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = v_uid AND p.role = 'admin'))
  ) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  INSERT INTO public.qr_tokens (item_id, token, purpose, expires_at, created_by)
  VALUES (p_item_id, v_token, p_purpose, v_expires, v_uid);

  RETURN v_token;
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_item ON public.ewaste_assignments(item_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user ON public.ewaste_assignments(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_item ON public.tracking_events(item_id);
CREATE INDEX IF NOT EXISTS idx_tracking_event_type ON public.tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_item ON public.qr_tokens(item_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires ON public.qr_tokens(expires_at);

