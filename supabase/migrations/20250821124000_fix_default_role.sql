-- Ensure profiles.role has a valid default in the new enum
ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'individual'::public.user_role;

