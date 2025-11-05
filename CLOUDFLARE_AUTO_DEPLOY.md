# Setting Up Automatic Deployment with Cloudflare Pages

This guide will help you connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

## Step 1: Go to Cloudflare Pages Dashboard

1. Navigate to: https://dash.cloudflare.com/d0e5dce99ade24849437adc71d0fb056/pages
2. Find your project: `bethany-sda-church`
3. Click on the project

## Step 2: Connect to Git Repository

Since we already created the project via CLI, we need to enable Git integration:

1. In your project dashboard, click **Settings** (left sidebar)
2. Scroll down to **Builds & deployments**
3. Click **Connect to Git**
4. Click **Connect GitHub**
5. Authorize Cloudflare Pages to access your GitHub account
6. Select the repository: `Shiryu-Studios-LLC/BethanySDAWebsite`
7. Click **Install & Authorize**

## Step 3: Configure Build Settings

After connecting GitHub, configure the build settings:

### Production Branch
- **Branch**: `master` (or `main` if that's your default)
- This branch will deploy to: https://bethany-sda-church.pages.dev

### Build Configuration

#### Framework preset:
Select **None** (we'll use custom settings)

#### Build settings:
```
Root directory (optional): BethanyWebsite.Client
Build command: dotnet publish -c Release
Build output directory: bin/Release/net9.0/publish/wwwroot
```

**Important Notes:**
- The root directory should be `BethanyWebsite.Client` because we want to build the Blazor WASM project
- Cloudflare Pages will automatically install .NET SDK
- The output directory is relative to the root directory

### Environment Variables

Add these environment variables (if needed):

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `ApiBaseUrl` | `https://your-api-url.com` | Your API service URL |
| `DOTNET_VERSION` | `9.0` | .NET version (optional, usually auto-detected) |

## Step 4: Alternative - Use wrangler.toml (Recommended)

Instead of configuring in the dashboard, you can use the `wrangler.toml` file already in the project:

**Location**: `BethanyWebsite.Client/wrangler.toml`

```toml
name = "bethany-sda-church"
compatibility_date = "2025-01-01"

[build]
command = "dotnet publish -c Release -o output"
cwd = "."
watch_dirs = ["Pages", "Layout", "wwwroot"]

[build.upload]
format = "service-worker"
dir = "bin/Release/net9.0/publish/wwwroot"

[env.production]
name = "bethany-sda-church"

[env.preview]
name = "bethany-sda-church-preview"
```

## Step 5: Configure Preview Deployments

Preview deployments create unique URLs for every branch and pull request.

### Preview Branch Settings:
- **Enable preview deployments**: ✅ Yes
- **Branch include pattern**: `*` (all branches)
- **Branch exclude pattern**: `master` (or your production branch)

Each preview will get a URL like:
- Branch: `https://[branch-name].bethany-sda-church.pages.dev`
- PR: `https://[pr-number].bethany-sda-church.pages.dev`

## Step 6: Set Up Build Notifications (Optional)

1. Go to **Settings** → **Notifications**
2. Enable notifications for:
   - ✅ Deployment started
   - ✅ Deployment success
   - ✅ Deployment failure
3. Choose notification method:
   - Email
   - Webhook (for Slack, Discord, etc.)

## Step 7: Verify Automatic Deployment

### Test the setup:

1. Make a small change to your code (e.g., update text in `Home.razor`)
2. Commit and push to your branch:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin okashi-dev-aspire
   ```
3. Go to Cloudflare Pages dashboard
4. You should see a new deployment starting automatically
5. Watch the build logs in real-time
6. Once complete, your site will be live!

## Deployment URLs

After setup, you'll have:

| Branch | URL | Purpose |
|--------|-----|---------|
| `master` | https://bethany-sda-church.pages.dev | Production site |
| `okashi-dev-aspire` | https://okashi-dev-aspire.bethany-sda-church.pages.dev | Development preview |
| Pull Requests | https://[pr-number].bethany-sda-church.pages.dev | PR previews |

## Workflow After Setup

### For Development:
1. Create a new branch or use `okashi-dev-aspire`
2. Make your changes
3. Commit and push
4. Cloudflare automatically builds and deploys to preview URL
5. Test the preview
6. Merge to master when ready
7. Production site automatically updates!

### For Production:
1. Merge approved changes to `master` branch
2. Cloudflare automatically:
   - Runs the build
   - Runs tests (if configured)
   - Deploys to production
   - Invalidates CDN cache
3. Site is live in ~30-60 seconds!

## Build Time Expectations

- **Blazor WASM Build**: ~1-2 minutes
- **Cloudflare Upload**: ~10-30 seconds
- **Total Deployment**: ~2-3 minutes

## Troubleshooting

### Build Fails

1. Check build logs in Cloudflare Pages dashboard
2. Common issues:
   - Wrong root directory
   - Missing dependencies
   - Incorrect build command
   - .NET version mismatch

### Solution:
- Make sure `Root directory` is set to `BethanyWebsite.Client`
- Verify build command: `dotnet publish -c Release`
- Check output directory: `bin/Release/net9.0/publish/wwwroot`

### Environment Variables Not Working

If your API URL isn't being picked up:
1. Check that `ApiBaseUrl` is set in Pages settings
2. Verify it's in the correct environment (Production vs Preview)
3. Make sure your code reads from `IConfiguration["ApiBaseUrl"]`

### Cache Issues

If changes aren't showing up:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. In Pages dashboard, click "Retry deployment" with "Clear build cache"

## Rollback Procedure

If something goes wrong:

1. Go to your project in Pages dashboard
2. Click **Deployments** tab
3. Find a previous working deployment
4. Click the **⋯** menu → **Rollback to this deployment**
5. Site reverts in seconds!

## Custom Domain (Optional)

To use your own domain (e.g., `bethanysda.org`):

1. Go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter your domain
4. Add CNAME record to your DNS:
   ```
   CNAME @ bethany-sda-church.pages.dev
   ```
5. Wait for DNS propagation (~5-10 minutes)
6. Cloudflare automatically provisions SSL certificate

## Security Best Practices

1. **Protect your master branch**:
   - Go to GitHub → Settings → Branches
   - Add branch protection rule for `master`
   - Require pull request reviews
   - Require status checks to pass

2. **Environment variables**:
   - Never commit sensitive data
   - Use Cloudflare Pages environment variables for secrets
   - Different values for Production vs Preview

3. **Access control**:
   - In Pages settings, configure who can trigger deployments
   - Use Cloudflare Access for private previews

## Monitoring

### Cloudflare Analytics

Pages provides analytics for:
- Page views
- Unique visitors
- Top countries
- Traffic sources
- Performance metrics

Access at: Pages Dashboard → Analytics

### Build History

View all deployments:
- Build duration
- Commit hash
- Deployment status
- Build logs
- Deployment URL

## Cost

Cloudflare Pages Free Tier:
- **Builds**: 500 builds/month
- **Bandwidth**: Unlimited
- **Requests**: Unlimited
- **Sites**: Unlimited

Perfect for your church website!

## Next Steps

After automatic deployment is set up:

1. **Set up branch protection** on GitHub
2. **Configure custom domain** (if desired)
3. **Enable build notifications**
4. **Test the workflow** with a small change
5. **Train your team** on the git workflow

## Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Community Discord: https://discord.gg/cloudflaredev
- GitHub Issues: https://github.com/Shiryu-Studios-LLC/BethanySDAWebsite/issues

---

## Quick Reference Commands

```bash
# Check current branch
git branch

# Create new feature branch
git checkout -b feature/new-feature

# Make changes, commit, and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# After preview looks good, merge to master
git checkout master
git merge feature/new-feature
git push origin master

# Deployment happens automatically!
```

---

**You're all set!** 🎉 Every push to GitHub will now automatically deploy to Cloudflare Pages.
