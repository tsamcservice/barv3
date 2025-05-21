-- 先刪除已存在的資料表（如果需要重新建立）
DROP TABLE IF EXISTS promo_cards;
DROP TABLE IF EXISTS member_cards;
DROP TABLE IF EXISTS users;

-- 建立 users 會員資料表
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id text NOT NULL UNIQUE,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 建立 member_cards 會員卡片表
CREATE TABLE member_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL,
  line_user_id text,
  user_id uuid REFERENCES users(id),
  card_alt_title text,
  main_image_url text,
  main_image_link text,
  snow_image_url text,
  calendar_image_url text,
  calendar_image_link text,
  amember_id text,
  love_icon_url text,
  love_icon_link text,
  pageview int DEFAULT 0,
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
  flex_json jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_page_user UNIQUE (page_id, line_user_id)
);

-- 建立 promo_cards 宣傳卡片表
CREATE TABLE promo_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  card_id uuid REFERENCES member_cards(id),
  json_content jsonb,
  sort_order int,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_member_cards_page_id ON member_cards(page_id);
CREATE INDEX IF NOT EXISTS idx_member_cards_line_user_id ON member_cards(line_user_id);
CREATE INDEX IF NOT EXISTS idx_promo_cards_card_id ON promo_cards(card_id);

-- 插入預設卡片資料
INSERT INTO member_cards (
  page_id,
  card_alt_title,
  main_image_url,
  main_image_link,
  snow_image_url,
  calendar_image_url,
  calendar_image_link,
  amember_id,
  love_icon_url,
  love_icon_link,
  pageview,
  main_title_1,
  main_title_1_color,
  main_title_2,
  main_title_2_color,
  member_image_url,
  member_image_link,
  display_name,
  name_color1,
  button_1_text,
  button_1_url,
  button_1_color,
  s_button_text,
  s_button_url,
  s_button_color,
  flex_json
) VALUES (
  'M01001',
  '我在呈璽',
  '我在呈璽/呈璽',
  'https://barv2.vercel.app/uploads/vip/TS-B1.png',
  'https://secure.smore.com/n/td1qc',
  'https://barv2.vercel.app/uploads/vip/APNG1.png',
  'https://barv2.vercel.app/uploads/vip/icon_calendar.png',
  'https://lihi3.cc/ZWV2u',
  'TSAMC',
  'https://barv2.vercel.app/uploads/vip/loveicon.png',
  'https://lihi.cc/jl7Pw',
  0,
  '我在呈璽',
  '#000000',
  '我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！',
  '#000000',
  'https://barv2.vercel.app/uploads/vip/TS-LOGO.png',
  'https://secure.smore.com/n/td1qc',
  '呈璽',
  '#A4924C',
  '加呈璽好友',
  'https://lin.ee/JLLIBlP',
  '#A4924A',
  '分享給好友',
  'https://liff.line.me/2007327814-BdWpj70m?pageId=M01001',
  '#A4924B',
  '{
    "type": "flex",
    "altText": "我在呈璽/呈璽",
    "contents": {
      "type": "bubble",
      "size": "mega",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "size": "full",
            "aspectRatio": "1:1",
            "aspectMode": "cover",
            "url": "https://barv2.vercel.app/uploads/vip/TS-B1.png"
          },
          {
            "type": "image",
            "url": "https://barv2.vercel.app/uploads/vip/APNG1.png",
            "size": "full",
            "aspectRatio": "1:1",
            "animated": true,
            "aspectMode": "cover",
            "position": "absolute",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://secure.smore.com/n/td1qc"
            }
          },
          {
            "type": "box",
            "width": "90px",
            "layout": "horizontal",
            "spacing": "none",
            "contents": [
              {
                "type": "box",
                "action": {
                  "uri": "https://lihi3.cc/ZWV2u",
                  "type": "uri",
                  "label": "VIP會員號碼"
                },
                "layout": "vertical",
                "contents": [
                  {
                    "url": "https://barv2.vercel.app/uploads/vip/icon_calendar.png",
                    "type": "image",
                    "action": {
                      "uri": "https://lihi3.cc/ZWV2u",
                      "type": "uri",
                      "label": "action"
                    },
                    "size": "35px"
                  },
                  {
                    "type": "text",
                    "text": "TSAMC",
                    "size": "10px",
                    "align": "center",
                    "gravity": "center",
                    "offsetTop": "30px",
                    "position": "absolute",
                    "offsetStart": "12px",
                    "color": "#FFFFFF"
                  }
                ],
                "cornerRadius": "30px",
                "backgroundColor": "#A4924A"
              },
              {
                "type": "box",
                "action": {
                  "uri": "https://lihi.cc/jl7Pw",
                  "type": "uri",
                  "label": "愛心會員號碼"
                },
                "layout": "vertical",
                "contents": [
                  {
                    "url": "https://barv2.vercel.app/uploads/vip/loveicon.png",
                    "type": "image",
                    "action": {
                      "uri": "https://lihi.cc/jl7Pw",
                      "type": "uri",
                      "label": "action"
                    },
                    "size": "32px"
                  },
                  {
                    "type": "text",
                    "size": "10px",
                    "align": "center",
                    "gravity": "center",
                    "position": "absolute",
                    "offsetTop": "30px",
                    "offsetStart": "12px",
                    "text": "0000",
                    "color": "#FFFFFF"
                  }
                ],
                "cornerRadius": "30px",
                "backgroundColor": "#d00308"
              }
            ],
            "offsetTop": "250px",
            "offsetStart": "10px",
            "height": "45px",
            "position": "absolute"
          },
          {
            "size": "20px",
            "text": "我在呈璽",
            "type": "text",
            "align": "center",
            "color": "#000000",
            "weight": "bold",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！",
                "wrap": true,
                "size": "16px",
                "margin": "sm",
                "color": "#000000"
              }
            ],
            "paddingEnd": "65px",
            "paddingStart": "5px",
            "height": "95px"
          },
          {
            "type": "box",
            "width": "65px",
            "layout": "vertical",
            "spacing": "none",
            "contents": [
              {
                "type": "box",
                "action": {
                  "uri": "https://secure.smore.com/n/td1qc",
                  "type": "uri",
                  "label": "action"
                },
                "layout": "vertical",
                "contents": [
                  {
                    "url": "https://barv2.vercel.app/uploads/vip/TS-LOGO.png",
                    "type": "image",
                    "action": {
                      "uri": "https://secure.smore.com/n/td1qc",
                      "type": "uri",
                      "label": "官網"
                    },
                    "aspectRatio": "1:1",
                    "aspectMode": "cover",
                    "backgroundColor": "#E1E6E0"
                  }
                ],
                "cornerRadius": "35px",
                "borderWidth": "semi-bold",
                "borderColor": "#a4924c"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "size": "14px",
                    "text": "呈璽",
                    "style": "italic",
                    "color": "#a4924c",
                    "align": "center",
                    "weight": "bold",
                    "wrap": true,
                    "margin": "none"
                  }
                ],
                "paddingAll": "none",
                "cornerRadius": "none",
                "margin": "none",
                "spacing": "none"
              }
            ],
            "position": "absolute",
            "offsetEnd": "5px",
            "margin": "md",
            "offsetTop": "315px"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "加呈璽好友",
                  "uri": "https://lin.ee/JLLIBlP"
                },
                "color": "#a4924a",
                "style": "primary",
                "height": "sm",
                "offsetEnd": "1px"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "分享給好友",
                  "uri": "https://liff.line.me/2007327814-BdWpj70m?pageId=M01001"
                },
                "color": "#a4924b",
                "style": "primary",
                "height": "sm",
                "offsetStart": "1px"
              }
            ],
            "margin": "md"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "paddingAll": "10px"
      },
      "footer": {
        "type": "box",
        "layout": "horizontal",
        "spacing": "none",
        "contents": [
          {
            "type": "text",
            "text": "呈璽元宇宙3D展覽館",
            "wrap": true,
            "color": "#00000050",
            "align": "center",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://lihi3.cc/LY5qf"
            },
            "size": "sm",
            "margin": "none"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "height": "30px",
        "margin": "none",
        "paddingAll": "2px"
      },
      "styles": {
        "footer": {
          "separatorColor": "#000000",
          "separator": true
        }
      }
    }
  }'::jsonb
);

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 創建 Storage 儲存桶
INSERT INTO storage.buckets (id, name, public) VALUES
  ('member-cards', 'member-cards', true)
ON CONFLICT (id) DO NOTHING;

-- 設定 Storage 權限策略
CREATE POLICY "允許公開讀取 member-cards 儲存桶"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-cards');

CREATE POLICY "允許已認證用戶上傳到 member-cards 儲存桶"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'member-cards' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "允許用戶更新自己的檔案"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'member-cards' AND
    auth.uid() = owner
  );

CREATE POLICY "允許用戶刪除自己的檔案"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'member-cards' AND
    auth.uid() = owner
  ); 