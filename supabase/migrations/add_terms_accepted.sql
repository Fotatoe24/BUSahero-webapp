-- Run this once in your Supabase project's SQL editor (or via the
-- Supabase CLI) before the persistent Terms & Conditions acceptance
-- feature will work. Nothing in the web app runs this automatically —
-- app/api/me and app/api/accept-terms degrade gracefully if it hasn't
-- been applied yet (existing users just keep seeing the Terms popup
-- until they accept, which is the safe default), but acceptance won't
-- actually persist until this column exists.

alter table operators
  add column if not exists terms_accepted boolean not null default false;
