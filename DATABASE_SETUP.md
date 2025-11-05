# Database Setup Instructions

This project uses Cloudflare D1 (SQLite) for database storage.

## Setup Steps

### 1. Create D1 Database

```bash
# Create the database
wrangler d1 create bethany-sda-db
```

This will output a database ID. Copy that ID and replace `YOUR_D1_DATABASE_ID` in `wrangler.toml`.

### 2. Initialize Database Schema

```bash
# Run the schema to create tables and insert default data
wrangler d1 execute bethany-sda-db --file=./schema.sql
```

### 3. Verify Database Setup

```bash
# List all tables
wrangler d1 execute bethany-sda-db --command="SELECT name FROM sqlite_master WHERE type='table'"

# Check site settings
wrangler d1 execute bethany-sda-db --command="SELECT * FROM site_settings"
```

## Database Structure

### Tables

1. **site_settings** - General site-wide settings (key-value pairs)
   - churchName, tagline, description
   - email, phone, address, city, state, zipCode
   - sabbathSchool, worshipService, prayerMeeting
   - facebook, youtube, instagram, twitter

2. **homepage_settings** - Homepage specific settings
   - hero_video_url, hero_image_url
   - welcome_message
   - live_stream_url, show_live_stream

3. **visit_page_settings** - Visit page content
   - page_title, page_description

4. **about_page_settings** - About page content
   - mission_statement, our_history, our_beliefs

## API Endpoints

All endpoints are available at `/api/settings/{path}`:

- `GET /api/settings/site` - Get all site settings
- `PUT /api/settings/site` - Update site settings
- `GET /api/settings/homepage` - Get homepage settings
- `PUT /api/settings/homepage` - Update homepage settings
- `GET /api/settings/visit-page` - Get visit page settings
- `PUT /api/settings/visit-page` - Update visit page settings
- `GET /api/settings/about-page` - Get about page settings
- `PUT /api/settings/about-page` - Update about page settings

## Local Development

```bash
# Start local development server with D1
npm run dev
```

## Production Deployment

After setting up D1 and updating wrangler.toml with your database ID:

```bash
# Deploy to Cloudflare Pages
npm run deploy
```

The D1 database will be automatically bound to your Pages Functions.

## Migration from localStorage

The frontend code has been updated to use the API endpoints instead of localStorage. The localStorage code has been removed and replaced with API calls.
