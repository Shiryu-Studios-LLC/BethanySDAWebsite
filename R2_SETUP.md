# Cloudflare R2 Storage Setup Guide

## ✅ Completed Steps

1. **R2 Enabled** - Your Cloudflare account has R2 enabled
2. **Bucket Created** - `bethany-church-media` bucket created in ENAM (East North America) region

## Next Steps: Generate R2 API Credentials

To allow your .NET API to access R2, you need to create API credentials:

### Step 1: Create R2 API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/d0e5dce99ade24849437adc71d0fb056/r2/overview)

2. Click on "Manage R2 API Tokens" (in the right sidebar)

3. Click "Create API Token"

4. Configure the token:
   - **Token Name:** `bethany-api-r2-access`
   - **Permissions:**
     - ✅ Object Read & Write
   - **Specify bucket (optional but recommended):** `bethany-church-media`
   - **TTL:** Never expire (or set based on your security requirements)

5. Click "Create API Token"

6. **IMPORTANT:** Copy these values - they won't be shown again!
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (something like: `https://d0e5dce99ade24849437adc71d0fb056.r2.cloudflarestorage.com`)

### Step 2: Store Credentials Securely

**For Development (Local):**

```bash
cd /Users/okashikami/Repos/BethanySDAWebsite/BethanyWebsite.ApiService
dotnet user-secrets init
dotnet user-secrets set "R2:AccessKeyId" "YOUR_ACCESS_KEY_ID"
dotnet user-secrets set "R2:SecretAccessKey" "YOUR_SECRET_ACCESS_KEY"
dotnet user-secrets set "R2:AccountId" "d0e5dce99ade24849437adc71d0fb056"
dotnet user-secrets set "R2:BucketName" "bethany-church-media"
```

**For Production:**

Set environment variables in your hosting environment:
- `R2__AccessKeyId`
- `R2__SecretAccessKey`
- `R2__AccountId`
- `R2__BucketName`

### Step 3: Public Access Configuration (Optional)

If you want images/videos to be publicly accessible:

1. Go to your bucket in the R2 dashboard
2. Click "Settings"
3. Under "Public Access", click "Allow Access"
4. Copy the public bucket URL (e.g., `https://pub-xxxxx.r2.dev`)

Alternatively, use a custom domain:
1. In bucket settings, click "Connect Domain"
2. Enter your domain/subdomain (e.g., `media.bethanysda.org`)
3. Configure DNS as instructed

## R2 Bucket Information

- **Bucket Name:** `bethany-church-media`
- **Region:** ENAM (East North America)
- **Storage Class:** Standard
- **Account ID:** `d0e5dce99ade24849437adc71d0fb056`

## What You Can Store

This bucket is configured for:
- **Images:** Church photos, event images, gallery photos
- **Videos:** Hero video, sermon videos, event recordings
- **Documents:** PDFs, bulletins, announcements
- **Audio:** Sermon audio, music

## File Organization Recommendations

```
bethany-church-media/
├── images/
│   ├── hero/
│   ├── events/
│   ├── gallery/
│   └── team/
├── videos/
│   ├── hero/
│   └── sermons/
├── audio/
│   └── sermons/
└── documents/
    └── bulletins/
```

## Next: Code Implementation

Once you have the API credentials:
1. I'll install the AWS S3 SDK (R2 is S3-compatible)
2. Create a storage service class
3. Add configuration to your API
4. Create upload/download endpoints
5. Test the integration

## Costs

Cloudflare R2 Free Tier includes:
- **Storage:** 10 GB/month
- **Class A Operations:** 1 million/month (writes, lists)
- **Class B Operations:** 10 million/month (reads)
- **Egress:** FREE (unlimited)

After free tier:
- Storage: $0.015/GB/month
- Class A: $4.50/million operations
- Class B: $0.36/million operations
