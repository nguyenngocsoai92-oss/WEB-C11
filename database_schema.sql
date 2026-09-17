-- VBNA CHAPTER 11 ERP V5
-- PostgreSQL / Supabase-ready logical schema
-- Production note: UUIDs, RLS policies, storage buckets, SMTP provider and backups should be enabled before go-live.

create extension if not exists pgcrypto;

create table terms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'active' check(status in ('planned','active','closed')),
  created_at timestamptz not null default now()
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  city text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table departments (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  code text not null,
  name text not null,
  scope text,
  sort_order int not null default 0,
  unique(chapter_id, code)
);

create table power_teams (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  code text not null,
  name text not null,
  description text,
  active boolean not null default true,
  unique(chapter_id, code)
);

create table members (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  member_code text not null,
  full_name text not null,
  phone text not null,
  email text,
  date_of_birth date,
  home_address text,
  company_name text,
  company_title text,
  business_address text,
  tax_code text,
  industry text,
  products_services text,
  power_team_id uuid references power_teams(id),
  join_date date,
  admit_date date,
  stop_date date,
  stop_reason text,
  annual_fee_due_date date,
  status text not null default 'pending' check(status in ('pending','active','paused','left','terminated','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(chapter_id, member_code),
  unique(chapter_id, phone)
);

create table member_departments (
  member_id uuid not null references members(id) on delete cascade,
  department_id uuid not null references departments(id) on delete cascade,
  term_id uuid not null references terms(id),
  position_name text,
  is_lead boolean not null default false,
  active boolean not null default true,
  primary key(member_id, department_id, term_id)
);

create table member_documents (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  document_type text not null check(document_type in ('business_license','id_card','storefront','decision','other')),
  file_name text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  confidential boolean not null default true,
  uploaded_by uuid,
  uploaded_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  member_id uuid unique references members(id),
  username text unique not null,
  phone text,
  email text,
  password_hash text not null,
  role_code text not null,
  active boolean not null default true,
  force_password_change boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

create table roles (
  code text primary key,
  name text not null,
  description text
);

create table permissions (
  code text primary key,
  name text not null
);

create table role_permissions (
  role_code text references roles(code) on delete cascade,
  permission_code text references permissions(code) on delete cascade,
  primary key(role_code, permission_code)
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  full_name text not null,
  phone text not null,
  email text,
  address text,
  business_type text,
  company_name text,
  tax_code text,
  industry text,
  products_services text,
  source text,
  inviter_member_id uuid references members(id),
  crm_status text not null default 'new',
  created_at timestamptz not null default now(),
  unique(chapter_id, phone)
);

create table vbna_people (
  id uuid primary key default gen_random_uuid(),
  person_group text not null check(person_group in ('HDSL','HDTV','CHAPTER_PRESIDENT','LEADER_TEAM')),
  chapter_code text,
  department_name text,
  full_name text not null,
  phone text,
  email text,
  company_name text,
  industry text,
  home_address text,
  business_address text,
  created_at timestamptz not null default now()
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  term_id uuid references terms(id),
  name text not null,
  meeting_date date not null,
  meeting_time time,
  location text,
  term_week int,
  public_code text unique not null,
  status text not null default 'scheduled' check(status in ('scheduled','open','closed','cancelled')),
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  person_type text not null check(person_type in ('member','guest','vbna_person')),
  person_ref uuid,
  full_name text not null,
  phone text,
  role_name text,
  chapter_code text,
  company_name text,
  inviter_member_id uuid references members(id),
  checked_at timestamptz not null default now(),
  unique(meeting_id, person_type, person_ref)
);
create unique index attendance_meeting_phone_unique on attendance(meeting_id, phone) where phone is not null;

create table opportunity_types (
  code text primary key,
  name text not null,
  sort_order int not null default 0
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id),
  term_id uuid references terms(id),
  giver_member_id uuid not null references members(id),
  receiver_type text not null check(receiver_type in ('member','guest','external')),
  receiver_ref uuid,
  receiver_name text not null,
  opportunity_type_code text not null references opportunity_types(code),
  amount numeric(18,2) not null default 0,
  status text not null default 'open' check(status in ('open','success','cancelled')),
  success_amount numeric(18,2) not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table finance_categories (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  kind text not null check(kind in ('income','expense')),
  name text not null,
  cost_type text not null default 'variable' check(cost_type in ('fixed','variable')),
  active boolean not null default true
);

create table finance_transactions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  term_id uuid references terms(id),
  voucher_no text not null,
  kind text not null check(kind in ('income','expense')),
  category_id uuid references finance_categories(id),
  cost_type text not null check(cost_type in ('fixed','variable')),
  amount numeric(18,2) not null check(amount>=0),
  member_id uuid references members(id),
  transaction_date date not null,
  method text,
  description text not null,
  status text not null default 'pending' check(status in ('draft','pending','approved','cancelled','locked')),
  created_by uuid not null references users(id),
  approved_by uuid references users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique(chapter_id, voucher_no)
);

create table finance_documents (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references finance_transactions(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid references users(id),
  uploaded_at timestamptz not null default now()
);

create table fee_obligations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id),
  fee_type text not null check(fee_type in ('annual','monthly','other')),
  period text not null,
  amount numeric(18,2) not null,
  due_date date not null,
  status text not null default 'unpaid' check(status in ('unpaid','pending','confirmed','waived','overdue')),
  confirmed_transaction_id uuid references finance_transactions(id),
  unique(member_id, fee_type, period)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  department_id uuid references departments(id),
  title text not null,
  event_date date not null,
  description text,
  priority text default 'normal',
  status text default 'planning',
  created_at timestamptz not null default now()
);

create table approvals (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  approval_type text not null,
  entity_type text not null,
  entity_id uuid,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check(status in ('pending','approved','rejected','cancelled')),
  requested_by uuid references users(id),
  approved_by uuid references users(id),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table audit_logs (
  id bigserial primary key,
  chapter_id uuid references chapters(id),
  user_id uuid references users(id),
  action text not null,
  entity_type text,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  member_id uuid references members(id),
  notification_type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table mail_outbox (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  body_text text,
  body_html text,
  status text not null default 'queued' check(status in ('queued','sent','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table lucky_draw_sessions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id),
  draw_mode text not null,
  draw_seconds int not null,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table lucky_draw_winners (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references lucky_draw_sessions(id) on delete cascade,
  meeting_id uuid not null references meetings(id),
  person_key text not null,
  full_name text not null,
  phone text,
  role_name text,
  chapter_code text,
  company_name text,
  won_at timestamptz not null default now(),
  unique(session_id, person_key)
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  created_by uuid not null references users(id),
  subject text not null,
  message text not null,
  priority text not null default 'normal',
  status text not null default 'open' check(status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Seed business constants
insert into roles(code,name) values
 ('admin','Admin'),('president','Chủ tịch'),('vice_president','Phó chủ tịch'),('secretary_lead','Trưởng ban Thư ký'),
 ('training_lead','Trưởng ban Đào tạo'),('guest_lead','Trưởng ban Khách mời'),('event_lead','Trưởng ban Sự kiện & Truyền thông'),
 ('development_lead','Trưởng ban Phát triển'),('orientation_lead','Trưởng ban Định hướng'),('support_director','Giám đốc hỗ trợ'),('member','Hội viên')
on conflict do nothing;

insert into opportunity_types(code,name,sort_order) values
 ('REF1','Referral cấp 1',1),('REF2','Referral cấp 2',2),('REF3','Referral cấp 3',3),('REF4','Referral cấp 4',4),('REF5','Referral cấp 5',5),('DANCE121','Dance 1-2-1',6),('THANKS','Cảm ơn đã nhận cơ hội',7)
on conflict do nothing;
