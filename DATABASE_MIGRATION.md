# Database Migration Guide

## Adding the Dynamic Pages Table

You need to run the following SQL to add the new `pages` table to your Cloudflare D1 database.

### Option 1: Using Wrangler CLI (Recommended)

```bash
# Make sure you're in the project directory
cd E:\VSProj\BethanySDAWebsite

# Run the migration
wrangler d1 execute bethany-sda-db --file=schema.sql --remote
```

### Option 2: Manual SQL via Cloudflare Dashboard

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Select your database: `bethany-sda-db`
4. Go to the **Console** tab
5. Paste and run this SQL:

```sql
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Verify the Migration

After running the migration, verify it worked:

```bash
wrangler d1 execute bethany-sda-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name='pages';" --remote
```

You should see the `pages` table listed.

## Testing the Feature

1. **Deploy to Cloudflare Pages** (automatic after git push)
2. **Log in to Admin Portal** at `/admin`
3. **Go to Pages** section
4. **Click "Create New Page"**
5. **Create a test page** (e.g., "Ministries")
6. **Visit the page** at `/{slug}` (e.g., `/ministries`)

## Features Available

### Admin Side:
- Create new pages with rich text editor
- Edit existing pages
- Delete pages
- Toggle publish status
- Add pages to navigation menu
- Set navigation order
- SEO meta descriptions

### Public Side:
- View published pages at `/{slug}`
- Unpublished pages return 404
- Sanitized HTML rendering (XSS protected)
- Responsive design matching site theme

## Troubleshooting

### Pages table doesn't exist
Run the migration SQL above.

### "Unauthorized" errors
Make sure you're logged in via Cloudflare Access at `/login`.

### Pages not showing up
Check that `is_published` is set to `1` (true) in the database.

### Can't access local development
The API endpoints bypass auth for localhost/127.0.0.1 automatically.
