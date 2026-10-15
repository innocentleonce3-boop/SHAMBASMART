create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'sw')),
  role text not null default 'farmer' check (role in ('farmer', 'extension_officer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.force_farmer_profile_role()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.role := 'farmer';
  return new;
end;
$$;

create trigger profiles_force_farmer_role
before insert on public.profiles
for each row execute function public.force_farmer_profile_role();

create function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_auth_user();

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  region text not null,
  district text,
  village text,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  area_hectares numeric(12, 3) not null check (area_hectares > 0),
  soil_type text,
  irrigation_type text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.farm_members (
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'worker', 'extension_officer')),
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  primary key (farm_id, user_id)
);

create function public.protect_farm_membership_identity()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.farm_id <> old.farm_id or new.user_id <> old.user_id then
    raise exception 'Farm membership identity cannot be changed';
  end if;
  if old.role <> 'owner' and new.role = 'owner' then
    raise exception 'Farm ownership cannot be assigned through membership updates';
  end if;
  return new;
end;
$$;

create trigger farm_members_protect_identity
before update on public.farm_members
for each row execute function public.protect_farm_membership_identity();

create function public.add_farm_owner_membership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.farm_members (farm_id, user_id, role, status)
  values (new.id, new.owner_id, 'owner', 'active');
  return new;
end;
$$;

create trigger farms_add_owner_membership
after insert on public.farms
for each row execute function public.add_farm_owner_membership();

create function public.is_farm_member(target_farm_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.farm_members fm
    where fm.farm_id = target_farm_id
      and fm.user_id = (select auth.uid())
      and fm.status = 'active'
  );
$$;

create function public.can_manage_farm(target_farm_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.farm_members fm
    where fm.farm_id = target_farm_id
      and fm.user_id = (select auth.uid())
      and fm.status = 'active'
      and fm.role in ('owner', 'manager')
  );
$$;

create function public.is_farm_owner(target_farm_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.farm_members fm
    where fm.farm_id = target_farm_id
      and fm.user_id = (select auth.uid())
      and fm.status = 'active'
      and fm.role = 'owner'
  );
$$;

create function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create table public.fields (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  area_hectares numeric(12, 3) not null check (area_hectares > 0),
  soil_type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, name)
);

create table public.crops (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_sw text not null,
  typical_duration_days integer check (typical_duration_days > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name_en, name_sw)
);

create table public.crop_varieties (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (crop_id, name)
);

create table public.crop_seasons (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete restrict,
  crop_id uuid not null references public.crops(id) on delete restrict,
  variety_id uuid references public.crop_varieties(id) on delete set null,
  season_name text not null,
  planting_date date not null,
  expected_harvest_date date,
  growth_stage text,
  cultivated_area_hectares numeric(12, 3) not null check (cultivated_area_hectares > 0),
  status text not null default 'planned' check (status in ('planned', 'active', 'harvested', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expected_harvest_date is null or expected_harvest_date >= planting_date)
);

create table public.farm_activities (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_season_id uuid references public.crop_seasons(id) on delete restrict,
  activity_type text not null check (activity_type in ('planting', 'irrigation', 'fertilization', 'weeding', 'pest_management', 'disease_treatment', 'labor', 'equipment', 'harvesting', 'other')),
  title text not null,
  description text,
  activity_date date not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  cost_tzs numeric(14, 2) check (cost_tzs is null or cost_tzs >= 0),
  created_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_inputs (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.farm_activities(id) on delete cascade,
  input_name text not null,
  quantity numeric(12, 3) check (quantity is null or quantity >= 0),
  unit text,
  cost_tzs numeric(14, 2) check (cost_tzs is null or cost_tzs >= 0),
  created_at timestamptz not null default now()
);

create table public.crop_observations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_season_id uuid references public.crop_seasons(id) on delete restrict,
  observed_at timestamptz not null default now(),
  growth_stage text,
  plant_condition text check (plant_condition in ('healthy', 'watch', 'poor', 'unknown')),
  symptoms text,
  pest_observations text,
  image_path text,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.disease_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.crop_observations(id) on delete cascade,
  risk_level text not null check (risk_level in ('low', 'moderate', 'high', 'unknown')),
  indicators jsonb not null default '[]'::jsonb,
  ruleset_version text not null,
  disclaimer text not null,
  created_at timestamptz not null default now()
);

create table public.weather_cache (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  provider text not null,
  forecast_for timestamptz not null,
  fetched_at timestamptz not null default now(),
  temperature_c numeric(5, 2),
  precipitation_mm numeric(7, 2),
  wind_speed_kmh numeric(7, 2),
  payload jsonb not null,
  unique (farm_id, provider, forecast_for)
);

create table public.harvests (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_season_id uuid not null references public.crop_seasons(id) on delete restrict,
  harvested_on date not null,
  quantity numeric(14, 3) not null check (quantity >= 0),
  unit text not null check (unit in ('kg', 'tonne', 'bag', 'crate', 'piece')),
  quality_grade text,
  damaged_quantity numeric(14, 3) not null default 0 check (damaged_quantity >= 0),
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (damaged_quantity <= quantity)
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  harvest_id uuid references public.harvests(id) on delete restrict,
  sold_on date not null,
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null check (unit in ('kg', 'tonne', 'bag', 'crate', 'piece')),
  unit_price_tzs numeric(14, 2) not null check (unit_price_tzs >= 0),
  total_tzs numeric(14, 2) generated always as (round(quantity * unit_price_tzs, 2)) stored,
  buyer text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_season_id uuid references public.crop_seasons(id) on delete restrict,
  expense_type text not null check (expense_type in ('input', 'labor', 'transport', 'equipment', 'other')),
  description text not null,
  amount_tzs numeric(14, 2) not null check (amount_tzs >= 0),
  spent_on date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create function public.is_conversation_creator(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.conversations c
    where c.id = target_conversation_id and c.created_by = (select auth.uid())
  );
$$;

create function public.is_conversation_member(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = target_conversation_id and cm.user_id = (select auth.uid())
  );
$$;

create function public.is_support_conversation(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.conversations c
    where c.id = target_conversation_id and c.subject like 'Support:%'
  );
$$;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.application_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create index farms_owner_id_idx on public.farms(owner_id);
create index farm_members_user_id_idx on public.farm_members(user_id, status);
create index fields_farm_id_idx on public.fields(farm_id);
create index crop_seasons_farm_status_idx on public.crop_seasons(farm_id, status);
create index farm_activities_farm_date_idx on public.farm_activities(farm_id, activity_date desc);
create index observations_farm_date_idx on public.crop_observations(farm_id, observed_at desc);
create index harvests_farm_date_idx on public.harvests(farm_id, harvested_on desc);
create index sales_farm_date_idx on public.sales(farm_id, sold_on desc);
create index expenses_farm_date_idx on public.expenses(farm_id, spent_on desc);
create index messages_conversation_date_idx on public.messages(conversation_id, created_at);
create index notifications_user_date_idx on public.notifications(user_id, created_at desc);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.fields enable row level security;
alter table public.crops enable row level security;
alter table public.crop_varieties enable row level security;
alter table public.crop_seasons enable row level security;
alter table public.farm_activities enable row level security;
alter table public.activity_inputs enable row level security;
alter table public.crop_observations enable row level security;
alter table public.disease_risk_assessments enable row level security;
alter table public.weather_cache enable row level security;
alter table public.harvests enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.application_settings enable row level security;

grant select, insert, update, delete on public.profiles, public.farms, public.farm_members,
  public.fields, public.crop_varieties, public.crop_seasons, public.farm_activities,
  public.activity_inputs, public.crop_observations, public.disease_risk_assessments,
  public.weather_cache, public.harvests, public.sales, public.expenses, public.conversations,
  public.conversation_members, public.messages, public.notifications, public.audit_logs,
  public.application_settings to authenticated;
grant select on public.crops to anon, authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke all on function public.is_farm_member(uuid) from public, anon;
revoke all on function public.can_manage_farm(uuid) from public, anon;
revoke all on function public.is_farm_owner(uuid) from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_conversation_creator(uuid) from public, anon;
revoke all on function public.is_conversation_member(uuid) from public, anon;
revoke all on function public.is_support_conversation(uuid) from public, anon;
grant execute on function public.is_farm_member(uuid), public.can_manage_farm(uuid),
  public.is_farm_owner(uuid), public.is_admin(), public.is_conversation_creator(uuid),
  public.is_conversation_member(uuid), public.is_support_conversation(uuid) to authenticated;

revoke update on public.farms from authenticated;
grant update (name, region, district, village, latitude, longitude, area_hectares, soil_type, irrigation_type, description, updated_at) on public.farms to authenticated;

revoke update on public.profiles from authenticated;
grant update (full_name, phone, preferred_language, updated_at) on public.profiles to authenticated;

create policy "profiles_select_self" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profiles_insert_self" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "profiles_update_self" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "farms_select_member" on public.farms for select to authenticated using (public.is_farm_member(id));
create policy "farms_insert_owner" on public.farms for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "farms_update_manager" on public.farms for update to authenticated using (public.can_manage_farm(id)) with check (public.can_manage_farm(id));
create policy "farms_delete_owner" on public.farms for delete to authenticated using (owner_id = (select auth.uid()));

create policy "farm_members_select_member" on public.farm_members for select to authenticated using (user_id = (select auth.uid()) or public.is_farm_member(farm_id));
create policy "farm_members_owner_add" on public.farm_members for insert to authenticated with check (
  public.can_manage_farm(farm_id)
  and role <> 'owner'
  and (role <> 'manager' or public.is_farm_owner(farm_id))
  and user_id <> (select auth.uid())
);
create policy "farm_members_owner_update" on public.farm_members for update to authenticated using (
  public.is_farm_owner(farm_id) or (public.can_manage_farm(farm_id) and role not in ('owner', 'manager'))
) with check (
  public.is_farm_owner(farm_id) or (public.can_manage_farm(farm_id) and role not in ('owner', 'manager'))
);
create policy "farm_members_manager_delete" on public.farm_members for delete to authenticated using (
  public.is_farm_owner(farm_id) or (public.can_manage_farm(farm_id) and role not in ('owner', 'manager'))
);

create policy "fields_member_access" on public.fields for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));
create policy "crops_active_read" on public.crops for select to anon, authenticated using (is_active);
create policy "crops_admin_manage" on public.crops for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "crop_varieties_member_read" on public.crop_varieties for select to authenticated using (true);
create policy "crop_varieties_admin_manage" on public.crop_varieties for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "crop_seasons_member_access" on public.crop_seasons for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));
create policy "activities_member_access" on public.farm_activities for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id) and created_by = (select auth.uid()));
create policy "activity_inputs_member_access" on public.activity_inputs for all to authenticated using (
  exists (select 1 from public.farm_activities a where a.id = activity_id and public.is_farm_member(a.farm_id))
) with check (
  exists (select 1 from public.farm_activities a where a.id = activity_id and public.is_farm_member(a.farm_id))
);
create policy "observations_member_access" on public.crop_observations for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id) and created_by = (select auth.uid()));
create policy "risk_assessments_member_read" on public.disease_risk_assessments for select to authenticated using (
  exists (select 1 from public.crop_observations o where o.id = observation_id and public.is_farm_member(o.farm_id))
);
create policy "risk_assessments_member_insert" on public.disease_risk_assessments for insert to authenticated with check (
  exists (select 1 from public.crop_observations o where o.id = observation_id and public.is_farm_member(o.farm_id))
);
create policy "weather_member_read" on public.weather_cache for select to authenticated using (public.is_farm_member(farm_id));
create policy "harvests_member_access" on public.harvests for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id) and created_by = (select auth.uid()));
create policy "sales_member_access" on public.sales for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));
create policy "expenses_member_access" on public.expenses for all to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));

create policy "conversations_member_read" on public.conversations for select to authenticated using (
  public.is_conversation_member(id)
);
create policy "conversations_member_create" on public.conversations for insert to authenticated with check (created_by = (select auth.uid()));
create policy "conversation_members_read_participant" on public.conversation_members for select to authenticated using (user_id = (select auth.uid()));
create policy "conversation_members_creator_add" on public.conversation_members for insert to authenticated with check (
  public.is_conversation_creator(conversation_id)
  and (user_id = (select auth.uid()) or public.is_admin())
);
create policy "conversation_members_update_self" on public.conversation_members for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "messages_member_read" on public.messages for select to authenticated using (
  public.is_conversation_member(conversation_id)
);
create policy "messages_member_send" on public.messages for insert to authenticated with check (
  sender_id = (select auth.uid()) and public.is_conversation_member(conversation_id)
);
create policy "notifications_self_access" on public.notifications for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "audit_logs_admin_read" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "settings_public_read_anon" on public.application_settings for select to anon using (is_public);
create policy "settings_public_read_authenticated" on public.application_settings for select to authenticated using (is_public or public.is_admin());
create policy "settings_admin_manage" on public.application_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('farm-media', 'farm-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

create policy "farm_media_member_read" on storage.objects for select to authenticated using (
  bucket_id = 'farm-media'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  and public.is_farm_member(((storage.foldername(name))[1])::uuid)
);
create policy "farm_media_member_upload" on storage.objects for insert to authenticated with check (
  bucket_id = 'farm-media'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  and public.is_farm_member(((storage.foldername(name))[1])::uuid)
);
create policy "farm_media_manager_delete" on storage.objects for delete to authenticated using (
  bucket_id = 'farm-media'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  and public.can_manage_farm(((storage.foldername(name))[1])::uuid)
);