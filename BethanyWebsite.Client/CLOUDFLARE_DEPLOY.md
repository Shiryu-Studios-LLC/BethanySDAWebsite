# Deploying Bethany SDA Church to Cloudflare Pages

## Option 1: Deploy with Wrangler CLI (Recommended)

### First Time Setup

1. **Build the project:**
   ```bash
   dotnet publish -c Release
   ```

2. **Create Cloudflare Pages project:**
   ```bash
   wrangler pages project create bethany-sda-church
   ```

3. **Deploy to Cloudflare Pages:**
   ```bash
   wrangler pages deploy bin/Release/net9.0/publish/wwwroot --project-name=bethany-sda-church
   ```

### Subsequent Deploys

```bash
dotnet publish -c Release
wrangler pages deploy bin/Release/net9.0/publish/wwwroot --project-name=bethany-sda-church
```

## Option 2: Deploy via Cloudflare Dashboard

1. **Build the project:**
   ```bash
   dotnet publish -c Release
   ```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → Create a project

3. Choose "Direct Upload"

4. Upload the contents of `bin/Release/net9.0/publish/wwwroot/`

## Option 3: Connect to Git Repository (Automatic Deployments)

1. Go to Cloudflare Dashboard → Pages → Create a project → Connect to Git

2. Select your repository

3. Configure build settings:
   - **Build command:** `dotnet publish -c Release`
   - **Build output directory:** `BethanyWebsite.Client/bin/Release/net9.0/publish/wwwroot`
   - **Root directory:** `BethanyWebsite.Client` (or leave empty if monorepo)

4. Add environment variable:
   - **Name:** `ApiBaseUrl`
   - **Value:** Your API URL (e.g., `https://api.bethanysda.org`)

5. Click "Save and Deploy"

## Environment Variables

For Cloudflare Pages, set these environment variables in the dashboard:

- `ApiBaseUrl`: The URL of your API service (e.g., `https://api.bethanysda.org`)

## Custom Domain

To add a custom domain:

1. Go to your Cloudflare Pages project → Custom domains
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `bethanysda.org`)
4. Follow the DNS configuration instructions

## Troubleshooting

### CORS Issues
Make sure your API service has CORS configured to allow requests from your Cloudflare Pages URL:
- `https://bethany-sda-church.pages.dev`
- `https://*.pages.dev` (for preview deployments)
- Your custom domain (if configured)

### API Not Connecting
1. Check the `appsettings.json` in `wwwroot/`
2. Verify the `ApiBaseUrl` environment variable in Cloudflare Pages settings
3. Make sure your API service is running and accessible

### Build Fails
- Ensure .NET 9 SDK is available in the build environment
- Check that all NuGet packages are properly restored
- Verify the build output directory path
