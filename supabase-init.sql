-- 建立 users 會員資料表
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null unique,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 建立 member_cards 會員卡片表
create table if not exists member_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  card_title text,
  main_image_url text,
  main_image_link text,
  snow_image_url text,
  calendar_image_url text,
  amember_id text,
  pageview int default 0,
  main_title_1 text,
  main_title_1_color text,
  main_title_2 text,
  main_title_2_color text,
  member_image_url text,
  member_image_link text,
  display_name text,
  name_color1 text,
  name_color2 text,
  button_1_text text,
  button_1_url text,
  button_1_color text,
  s_button_text text,
  s_button_url text,
  s_button_color text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 建立 promo_cards 宣傳卡片表
create table if not exists promo_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  card_id uuid references member_cards(id),
  json_content jsonb,
  sort_order int,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
); 