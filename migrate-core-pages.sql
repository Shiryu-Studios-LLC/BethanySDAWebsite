-- Migrate core pages to use the visual builder
-- These pages will use reserved slugs and be linked from the Pages admin

-- Insert Homepage as a page
INSERT OR IGNORE INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order)
VALUES (
  'home',
  'Homepage',
  '[]',
  'Welcome to Bethany SDA Church - Houston''s Haitian Seventh-day Adventist Community',
  1,
  0,
  1
);

-- Insert Visit Page
INSERT OR IGNORE INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order)
VALUES (
  'visit',
  'Plan Your Visit',
  '[]',
  'We''d love to meet you! Here''s everything you need to know for your first visit to Bethany SDA Church.',
  1,
  1,
  2
);

-- Insert About Page
INSERT OR IGNORE INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order)
VALUES (
  'about',
  'About Us',
  '[]',
  'Learn about our mission, history, and beliefs at Bethany SDA Church.',
  1,
  1,
  3
);
