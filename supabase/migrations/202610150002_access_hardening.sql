alter table public.fields add constraint fields_farm_id_id_unique unique (farm_id, id);
alter table public.crop_seasons add constraint crop_seasons_farm_id_id_unique unique (farm_id, id);
alter table public.harvests add constraint harvests_farm_id_id_unique unique (farm_id, id);

alter table public.crop_seasons
  add constraint crop_seasons_field_same_farm_fk
  foreign key (farm_id, field_id) references public.fields(farm_id, id);
alter table public.farm_activities
  add constraint farm_activities_season_same_farm_fk
  foreign key (farm_id, crop_season_id) references public.crop_seasons(farm_id, id);
alter table public.crop_observations
  add constraint observations_season_same_farm_fk
  foreign key (farm_id, crop_season_id) references public.crop_seasons(farm_id, id);
alter table public.harvests
  add constraint harvests_season_same_farm_fk
  foreign key (farm_id, crop_season_id) references public.crop_seasons(farm_id, id);
alter table public.expenses
  add constraint expenses_season_same_farm_fk
  foreign key (farm_id, crop_season_id) references public.crop_seasons(farm_id, id);
alter table public.sales
  add constraint sales_harvest_same_farm_fk
  foreign key (farm_id, harvest_id) references public.harvests(farm_id, id);

create function public.add_conversation_creator()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.conversation_members (conversation_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

create trigger conversations_add_creator
after insert on public.conversations
for each row execute function public.add_conversation_creator();

create policy "profiles_admin_read" on public.profiles
for select to authenticated using (public.is_admin());

create policy "conversations_admin_support_read" on public.conversations
for select to authenticated using (public.is_admin() and public.is_support_conversation(id));

create policy "conversation_members_admin_support_read" on public.conversation_members
for select to authenticated using (
  public.is_admin()
  and public.is_support_conversation(conversation_id)
);

create policy "conversation_members_admin_support_add" on public.conversation_members
for insert to authenticated with check (
  public.is_admin()
  and public.is_support_conversation(conversation_id)
);

create policy "messages_admin_support_read" on public.messages
for select to authenticated using (
  public.is_admin()
  and public.is_support_conversation(conversation_id)
);

create policy "messages_admin_support_send" on public.messages
for insert to authenticated with check (
  public.is_admin()
  and sender_id = (select auth.uid())
  and public.is_support_conversation(conversation_id)
);

create function public.admin_overview_counts()
returns table (users_count bigint, farms_count bigint, active_crop_seasons_count bigint, support_conversations_count bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;

  return query
  select
    (select count(*) from public.profiles),
    (select count(*) from public.farms),
    (select count(*) from public.crop_seasons where status = 'active'),
    (select count(*) from public.conversations where subject like 'Support:%');
end;
$$;

revoke all on function public.admin_overview_counts() from public, anon;
grant execute on function public.admin_overview_counts() to authenticated;