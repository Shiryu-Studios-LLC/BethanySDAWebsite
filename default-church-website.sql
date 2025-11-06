-- Professional Default Church Website Template
-- This creates a complete, professional church website with sample content

-- Clear existing pages (keep tables structure)
DELETE FROM pages;

-- Homepage with professional hero and content
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'home',
  'Homepage',
  '[
    {
      "id": "block-home-hero",
      "type": "hero",
      "content": {
        "title": "Welcome to Bethany SDA Church",
        "subtitle": "Join us in worship, fellowship, and service as we grow together in faith",
        "buttonText": "Plan Your Visit",
        "buttonUrl": "/visit",
        "backgroundType": "color",
        "backgroundColor": "#0054a6",
        "backgroundGradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "backgroundImage": "",
        "backgroundVideo": ""
      }
    },
    {
      "id": "block-home-welcome",
      "type": "text",
      "content": {
        "html": "<h2>Welcome Home</h2><p>Whether you''re a long-time member or visiting for the first time, we''re glad you''re here. Bethany SDA Church is a vibrant community of believers celebrating our Haitian heritage while welcoming all who seek to worship God.</p>"
      }
    },
    {
      "id": "block-home-services",
      "type": "columns",
      "content": {
        "columnCount": 3,
        "columns": [
          {
            "blocks": [
              {
                "id": "card-sabbath",
                "type": "card",
                "content": {
                  "icon": "📖",
                  "title": "Sabbath School",
                  "description": "Saturdays at 9:30 AM - Bible study and fellowship for all ages",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "card-worship",
                "type": "card",
                "content": {
                  "icon": "🙏",
                  "title": "Worship Service",
                  "description": "Saturdays at 11:00 AM - Join us for uplifting worship and inspiring messages",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "card-prayer",
                "type": "card",
                "content": {
                  "icon": "✨",
                  "title": "Prayer Meeting",
                  "description": "Wednesdays at 7:00 PM - Come together in prayer and Bible study",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "block-home-cta",
      "type": "callout",
      "content": {
        "title": "New Here?",
        "message": "We''d love to meet you! Learn more about what to expect when you visit.",
        "style": "info"
      }
    },
    {
      "id": "block-home-cta-button",
      "type": "button",
      "content": {
        "text": "Plan Your Visit",
        "url": "/visit",
        "style": "primary",
        "size": "lg"
      }
    }
  ]',
  'Welcome to Bethany SDA Church - Houston''s Haitian Seventh-day Adventist Community',
  1,
  0,
  1,
  1
);

-- Visit Page
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'visit',
  'Plan Your Visit',
  '[
    {
      "id": "block-visit-hero",
      "type": "hero",
      "content": {
        "title": "Plan Your Visit",
        "subtitle": "We''d love to meet you! Here''s everything you need to know.",
        "buttonText": "",
        "buttonUrl": "",
        "backgroundType": "color",
        "backgroundColor": "#28a745"
      }
    },
    {
      "id": "block-visit-intro",
      "type": "text",
      "content": {
        "html": "<h2>What to Expect</h2><p>Visiting a new church can be intimidating, but it doesn''t have to be! We want you to feel welcome and comfortable from the moment you arrive.</p>"
      }
    },
    {
      "id": "block-visit-times",
      "type": "columns",
      "content": {
        "columnCount": 2,
        "columns": [
          {
            "blocks": [
              {
                "id": "times-schedule",
                "type": "text",
                "content": {
                  "html": "<h3>Service Times</h3><ul><li><strong>Sabbath School:</strong> Saturdays 9:30 AM</li><li><strong>Worship Service:</strong> Saturdays 11:00 AM</li><li><strong>Prayer Meeting:</strong> Wednesdays 7:00 PM</li></ul>"
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "times-dress",
                "type": "text",
                "content": {
                  "html": "<h3>What to Wear</h3><p>Come as you are! While some dress more formally, you''ll see everything from suits to casual wear. The most important thing is that you''re here.</p>"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "block-visit-quote",
      "type": "quote",
      "content": {
        "quote": "We felt so welcomed from day one. The church family made us feel right at home!",
        "author": "New Member Testimonial",
        "role": ""
      }
    }
  ]',
  'Plan your visit to Bethany SDA Church. Service times, what to expect, and more.',
  1,
  1,
  2,
  1
);

-- About Page
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'about',
  'About Us',
  '[
    {
      "id": "block-about-hero",
      "type": "hero",
      "content": {
        "title": "About Us",
        "subtitle": "Our mission, history, and beliefs",
        "buttonText": "",
        "buttonUrl": "",
        "backgroundType": "color",
        "backgroundColor": "#6c757d"
      }
    },
    {
      "id": "block-about-mission",
      "type": "text",
      "content": {
        "html": "<h2>Our Mission</h2><p>To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.</p>"
      }
    },
    {
      "id": "block-about-history",
      "type": "text",
      "content": {
        "html": "<h2>Our History</h2><p>Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating our Haitian heritage while welcoming all who seek to worship God. We are part of the worldwide Seventh-day Adventist Church, committed to sharing the gospel and serving our community.</p>"
      }
    },
    {
      "id": "block-about-beliefs",
      "type": "callout",
      "content": {
        "title": "What We Believe",
        "message": "We believe in the Bible as God''s Word, salvation through Jesus Christ, observing the seventh-day Sabbath, and the soon return of Jesus.",
        "style": "success"
      }
    },
    {
      "id": "block-about-values",
      "type": "columns",
      "content": {
        "columnCount": 3,
        "columns": [
          {
            "blocks": [
              {
                "id": "value-worship",
                "type": "card",
                "content": {
                  "icon": "⛪",
                  "title": "Worship",
                  "description": "We gather to worship God through prayer, music, and the study of His Word",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "value-fellowship",
                "type": "card",
                "content": {
                  "icon": "🤝",
                  "title": "Fellowship",
                  "description": "We build genuine relationships and support one another in our faith journey",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "value-service",
                "type": "card",
                "content": {
                  "icon": "❤️",
                  "title": "Service",
                  "description": "We serve our community and share God''s love through practical acts of kindness",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          }
        ]
      }
    }
  ]',
  'Learn about Bethany SDA Church - our mission, history, and beliefs.',
  1,
  1,
  3,
  1
);
