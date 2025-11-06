-- Professional Default Church Website Template
-- Complete website inspired by Houston SDA with all modern components
-- This creates a professional church website with rich content

-- Clear existing pages (keep tables structure)
DELETE FROM pages;

-- Homepage with comprehensive content
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'home',
  'Homepage',
  '[
    {
      "id": "block-hero-1",
      "type": "hero",
      "content": {
        "title": "Impact Houston For Christ",
        "subtitle": "Join us in worship, fellowship, and service as we grow together in faith",
        "buttonText": "Plan Your Visit",
        "buttonUrl": "/visit",
        "backgroundType": "color",
        "backgroundColor": "#0054a6",
        "backgroundImage": "",
        "backgroundVideo": ""
      }
    },
    {
      "id": "block-text-welcome",
      "type": "text",
      "content": {
        "html": "<h2 style=\"text-align: center; margin-bottom: 1rem;\">Welcome Home</h2><p style=\"text-align: center; font-size: 1.1rem; color: #666; max-width: 800px; margin: 0 auto;\">Whether you are a long-time member or visiting for the first time, we are glad you are here. At Bethany SDA Church, you will find a warm, welcoming community dedicated to growing in faith together.</p>"
      }
    },
    {
      "id": "block-services",
      "type": "columns",
      "content": {
        "columnCount": 3,
        "columns": [
          {
            "blocks": [
              {
                "id": "card-sabbath-school",
                "type": "card",
                "content": {
                  "icon": "📖",
                  "title": "Sabbath School",
                  "description": "Interactive Bible study and fellowship for all ages",
                  "linkText": "Learn More",
                  "linkUrl": "/about#sabbath-school"
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
                  "description": "Uplifting praise and inspiring messages each Sabbath",
                  "linkText": "Learn More",
                  "linkUrl": "/about#worship"
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
                  "icon": "💭",
                  "title": "Prayer Meeting",
                  "description": "Midweek prayer and Bible study on Wednesdays",
                  "linkText": "Learn More",
                  "linkUrl": "/about#prayer"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "block-service-times",
      "type": "callout",
      "content": {
        "title": "Service Times",
        "message": "Sabbath School: Saturdays at 9:30 AM | Worship Service: Saturdays at 11:00 AM | Prayer Meeting: Wednesdays at 7:00 PM",
        "style": "info"
      }
    },
    {
      "id": "block-divider-1",
      "type": "divider",
      "content": {
        "thickness": 1,
        "color": "#dee2e6"
      }
    },
    {
      "id": "block-mission",
      "type": "text",
      "content": {
        "html": "<h2 style=\"text-align: center; margin-bottom: 1.5rem;\">Our Mission</h2><p style=\"text-align: center; font-size: 1.2rem; font-style: italic; color: #0054a6; max-width: 800px; margin: 0 auto;\">To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.</p>"
      }
    },
    {
      "id": "block-ministries",
      "type": "columns",
      "content": {
        "columnCount": 2,
        "columns": [
          {
            "blocks": [
              {
                "id": "text-youth",
                "type": "text",
                "content": {
                  "html": "<h3>Youth Ministry</h3><p>Engaging programs for young people to grow in faith, build friendships, and serve their community through Pathfinders, Adventurers, and youth activities.</p>"
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "text-community",
                "type": "text",
                "content": {
                  "html": "<h3>Community Outreach</h3><p>Serving Houston through food drives, health programs, and compassionate care for those in need.</p>"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "block-spacer-1",
      "type": "spacer",
      "content": {
        "height": 40
      }
    },
    {
      "id": "block-cta",
      "type": "text",
      "content": {
        "html": "<div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3rem 2rem; border-radius: 8px; text-align: center; color: white;\"><h2 style=\"color: white; margin-bottom: 1rem;\">Join Us This Sabbath</h2><p style=\"font-size: 1.1rem; margin-bottom: 1.5rem; color: white;\">Experience the warmth of our community and the power of worship</p><a href=\"/visit\" style=\"background: white; color: #667eea; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;\">Plan Your Visit</a></div>"
      }
    }
  ]',
  'Welcome to Bethany SDA Church - Houston''s Haitian Seventh-day Adventist Community',
  1,
  0,
  1,
  0
);

-- About Page with comprehensive church information
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'about',
  'About Us',
  '[
    {
      "id": "about-mission",
      "type": "text",
      "content": {
        "html": "<h2>Our Mission & Vision</h2><p style=\"font-size: 1.1rem;\">To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love. We envision a vibrant, multicultural congregation that reflects the diversity of Houston while maintaining our Haitian heritage and Adventist values.</p>"
      }
    },
    {
      "id": "about-history",
      "type": "text",
      "content": {
        "html": "<h2>Our History</h2><p>Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating our Haitian heritage while welcoming all who seek to worship God. Our church has been a spiritual home for families in the Houston area, providing worship services in both English and Haitian Creole.</p><p>Founded on the principles of Seventh-day Adventist faith, we believe in the Bible as God''s inspired word and look forward to the soon return of Jesus Christ.</p>"
      }
    },
    {
      "id": "about-beliefs",
      "type": "text",
      "content": {
        "html": "<h2>What We Believe</h2><p>As Seventh-day Adventists, we believe in:</p><ul style=\"font-size: 1.05rem; line-height: 1.8;\"><li><strong>The Bible</strong> as the inspired Word of God</li><li><strong>The Trinity</strong> - God the Father, Son, and Holy Spirit</li><li><strong>Salvation</strong> through faith in Jesus Christ alone</li><li><strong>The Sabbath</strong> - Honoring God on the seventh day (Saturday)</li><li><strong>Christ''s Return</strong> - The blessed hope of His soon coming</li><li><strong>Healthy Living</strong> - Caring for our bodies as temples of the Holy Spirit</li><li><strong>Community Service</strong> - Sharing God''s love through practical ministry</li></ul>"
      }
    },
    {
      "id": "about-programs",
      "type": "columns",
      "content": {
        "columnCount": 3,
        "columns": [
          {
            "blocks": [
              {
                "id": "program-sabbath-school",
                "type": "card",
                "content": {
                  "icon": "📚",
                  "title": "Sabbath School",
                  "description": "Small group Bible study with classes for all ages. Interactive discussions help us grow in understanding God''s Word.",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "program-worship",
                "type": "card",
                "content": {
                  "icon": "🎵",
                  "title": "Worship Service",
                  "description": "Uplifting music, prayer, and biblically-based sermons that inspire and challenge us to live for Christ.",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "program-prayer",
                "type": "card",
                "content": {
                  "icon": "🙌",
                  "title": "Prayer Meeting",
                  "description": "Wednesday evening gathering for prayer, testimony, and Bible study in an intimate setting.",
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
      "id": "about-ministries",
      "type": "text",
      "content": {
        "html": "<h2>Our Ministries</h2><p style=\"margin-bottom: 2rem;\">We offer various ministries to serve our congregation and community:</p>"
      }
    },
    {
      "id": "about-ministry-list",
      "type": "icon-list",
      "content": {
        "items": [
          {
            "icon": "👨‍👩‍👧‍👦",
            "title": "Family Ministries",
            "description": "Programs to strengthen marriages and families through seminars, retreats, and support groups"
          },
          {
            "icon": "👶",
            "title": "Children''s Ministry",
            "description": "Sabbath School and programs for kids from cradle roll through early teens"
          },
          {
            "icon": "🎓",
            "title": "Youth Ministry",
            "description": "Pathfinders, Adventurers, and teen activities that build character and faith"
          },
          {
            "icon": "🍲",
            "title": "Community Services",
            "description": "Food pantry, clothing distribution, and outreach programs for those in need"
          },
          {
            "icon": "💪",
            "title": "Health Ministry",
            "description": "Cooking classes, health screenings, and wellness programs"
          },
          {
            "icon": "🌍",
            "title": "Mission & Evangelism",
            "description": "Local and global mission opportunities to share the gospel"
          }
        ]
      }
    }
  ]',
  'Learn about Bethany SDA Church - our mission, history, beliefs, and ministries serving Houston',
  1,
  1,
  3,
  1
);

-- Visit Page with detailed information for first-time visitors
INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header) VALUES (
  'visit',
  'Plan Your Visit',
  '[
    {
      "id": "visit-welcome",
      "type": "text",
      "content": {
        "html": "<h2 style=\"text-align: center;\">What To Expect</h2><p style=\"text-align: center; font-size: 1.1rem; max-width: 800px; margin: 0 auto 2rem;\">Visiting a new church can feel overwhelming, but we want you to feel right at home. Here''s what you can expect when you visit Bethany SDA Church.</p>"
      }
    },
    {
      "id": "visit-times",
      "type": "columns",
      "content": {
        "columnCount": 2,
        "columns": [
          {
            "blocks": [
              {
                "id": "times-card",
                "type": "card",
                "content": {
                  "icon": "⏰",
                  "title": "Service Times",
                  "description": "Sabbath School: 9:30 AM | Worship Service: 11:00 AM | Prayer Meeting: Wednesday 7:00 PM",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "dress-card",
                "type": "card",
                "content": {
                  "icon": "👔",
                  "title": "What To Wear",
                  "description": "Come as you are! Most people wear business casual, but you''ll see everything from suits to jeans. Comfort is key.",
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
      "id": "visit-location",
      "type": "text",
      "content": {
        "html": "<h2>Location & Directions</h2><p style=\"font-size: 1.05rem;\"><strong>Bethany SDA Church</strong><br>Houston, Texas<br><em>(Address to be updated)</em></p><p>Free parking is available in our parking lot. Handicap accessible parking spots are located near the main entrance.</p>"
      }
    },
    {
      "id": "visit-first-time",
      "type": "callout",
      "content": {
        "title": "First Time Visitors",
        "message": "Look for our greeters at the entrance - they''ll help you find your way and answer any questions. We have a Welcome Center where you can get more information about our church and receive a visitor gift.",
        "style": "success"
      }
    },
    {
      "id": "visit-families",
      "type": "columns",
      "content": {
        "columnCount": 3,
        "columns": [
          {
            "blocks": [
              {
                "id": "children-card",
                "type": "card",
                "content": {
                  "icon": "👶",
                  "title": "Children''s Programs",
                  "description": "Age-appropriate Sabbath School classes from cradle roll through teens, plus children''s story time during worship",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "parking-card",
                "type": "card",
                "content": {
                  "icon": "🚗",
                  "title": "Parking",
                  "description": "Free parking with handicap accessible spots near the entrance. Additional overflow parking available.",
                  "linkText": "",
                  "linkUrl": ""
                }
              }
            ]
          },
          {
            "blocks": [
              {
                "id": "accessibility-card",
                "type": "card",
                "content": {
                  "icon": "♿",
                  "title": "Accessibility",
                  "description": "Wheelchair accessible facilities throughout the building with elevators and accessible restrooms.",
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
      "id": "visit-quote",
      "type": "quote",
      "content": {
        "quote": "We felt so welcomed from day one. The church family made us feel right at home and we knew this was where God wanted us to be.",
        "author": "First Time Visitor",
        "role": "Now a member"
      }
    },
    {
      "id": "visit-contact",
      "type": "text",
      "content": {
        "html": "<h2 style=\"text-align: center; margin-top: 2rem;\">Questions?</h2><p style=\"text-align: center;\">If you have any questions before your visit, please don''t hesitate to reach out. We''re here to help make your first visit comfortable and welcoming!</p>"
      }
    },
    {
      "id": "visit-cta-button",
      "type": "button",
      "content": {
        "text": "Contact Us",
        "url": "/contact",
        "style": "primary",
        "size": "lg"
      }
    }
  ]',
  'Plan your visit to Bethany SDA Church. Service times, directions, what to expect, and more.',
  1,
  1,
  2,
  1
);
