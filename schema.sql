-- Bethany SDA Website Database Schema

-- General site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Homepage settings
CREATE TABLE IF NOT EXISTS homepage_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_video_url TEXT,
  hero_image_url TEXT,
  welcome_message TEXT,
  live_stream_url TEXT,
  show_live_stream INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visit page settings
CREATE TABLE IF NOT EXISTS visit_page_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_title TEXT,
  page_description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About page settings
CREATE TABLE IF NOT EXISTS about_page_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mission_statement TEXT,
  our_history TEXT,
  our_beliefs TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic pages (user-created pages)
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published INTEGER DEFAULT 1,
  show_in_nav INTEGER DEFAULT 0,
  nav_order INTEGER DEFAULT 999,
  show_page_header INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('churchName', 'Bethany SDA Church'),
  ('tagline', 'Houston''s Haitian Seventh-day Adventist Community'),
  ('description', ''),
  ('email', ''),
  ('phone', ''),
  ('address', ''),
  ('city', ''),
  ('state', ''),
  ('zipCode', ''),
  ('sabbathSchool', 'Saturdays at 9:30 AM'),
  ('worshipService', 'Saturdays at 11:00 AM'),
  ('prayerMeeting', 'Wednesdays at 7:00 PM'),
  ('facebook', ''),
  ('youtube', ''),
  ('instagram', ''),
  ('twitter', '');

-- Insert default homepage settings
INSERT OR IGNORE INTO homepage_settings (id, hero_video_url, hero_image_url, welcome_message, live_stream_url, show_live_stream)
VALUES (1, '/videos/hero.mp4', '', 'Join us in worship, fellowship, and service as we grow together in faith', '', 0);

-- Insert default visit page settings
INSERT OR IGNORE INTO visit_page_settings (id, page_title, page_description)
VALUES (1, 'Plan Your Visit', 'We''d love to meet you! Here''s everything you need to know for your first visit to Bethany SDA Church.');

-- Insert default about page settings
INSERT OR IGNORE INTO about_page_settings (id, mission_statement, our_history, our_beliefs)
VALUES (1, 'To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.', 'Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating our Haitian heritage while welcoming all who seek to worship God.', '');
