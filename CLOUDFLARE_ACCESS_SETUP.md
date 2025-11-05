# Cloudflare Access Setup Guide

This guide will help you set up Cloudflare Access to protect your admin portal with Google/Microsoft authentication.

## Why Cloudflare Access?

Cloudflare Access is perfect for this church website because:
- ✅ Free for up to 50 users
- ✅ All staff already have Google/Microsoft accounts
- ✅ No backend code needed - runs at the edge
- ✅ Works with static sites on Cloudflare Pages
- ✅ Enterprise-grade security
- ✅ You can manage access permissions easily

## Prerequisites

1. Your site must be deployed to Cloudflare Pages (already done!)
2. Your domain must be on Cloudflare DNS
3. You need admin access to your Cloudflare account

## Step-by-Step Setup

### Step 1: Enable Cloudflare Zero Trust

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. In the left sidebar, click **Zero Trust**
3. If this is your first time, you'll need to:
   - Choose a team name (e.g., "bethany-sda-church")
   - This creates your Zero Trust domain: `bethany-sda-church.cloudflareaccess.com`

### Step 2: Configure Identity Providers

1. In Zero Trust dashboard, go to **Settings** → **Authentication**
2. Click **Add new** under Login methods
3. Select **Google** and/or **Microsoft**

#### For Google:
1. Click **Add Google**
2. Follow the setup wizard to create OAuth credentials
3. You'll need to create a Google Cloud project if you don't have one
4. Cloudflare will guide you through the OAuth setup

#### For Microsoft:
1. Click **Add Microsoft**
2. Follow the setup wizard to create Azure AD credentials
3. Cloudflare will guide you through the Azure AD setup

### Step 3: Create an Application

1. In Zero Trust dashboard, go to **Access** → **Applications**
2. Click **Add an application**
3. Select **Self-hosted**
4. Configure the application:

**Application Configuration:**
```
Application name: Bethany SDA Admin Portal
Session Duration: 24 hours
Application domain:
  - your-site.pages.dev/admin
  - your-site.pages.dev/admin/*
  - your-custom-domain.com/admin (if using custom domain)
  - your-custom-domain.com/admin/*
```

### Step 4: Set Up Access Policies

Now you'll create policies to control who can access the admin portal.

#### Policy 1: Site Owners (You and Pastor)

1. Click **Add a policy**
2. Policy name: `Site Owners`
3. Action: **Allow**
4. Configure rules:
   - **Rule name:** Site Owners
   - **Selector:** Emails
   - **Value:**
     - your-email@gmail.com (or Microsoft email)
     - pastor-email@gmail.com (or Microsoft email)

**Important:** As a site owner in this policy, you'll be able to:
- Access the admin portal
- Manage other users through Cloudflare dashboard
- Add/remove people from access policies

#### Policy 2: Church Staff (Optional)

If you want to add more staff members later:

1. Click **Add a policy**
2. Policy name: `Church Staff`
3. Action: **Allow**
4. Configure rules:
   - **Rule name:** Staff Members
   - **Selector:** Emails ending in
   - **Value:** `@your-church-domain.com` (if you have a church email domain)

   OR

   - **Selector:** Emails
   - **Value:** Add each staff member's email individually

### Step 5: Configure Application Settings

1. **Cookie settings:**
   - Enable **Same Site:** Lax
   - Enable **HTTP Only**

2. **CORS settings:** (if needed for API calls)
   - Add your domain origins

3. Click **Save application**

### Step 6: Test the Setup

1. Open an incognito/private browser window
2. Navigate to `your-site.pages.dev/login`
3. Click "Continue with Google" or "Continue with Microsoft"
4. You should be redirected to Cloudflare Access
5. Sign in with your Google/Microsoft account
6. If your email is in the allow list, you'll be granted access
7. You should be redirected to `/admin`

### Step 7: Update React App (Already Done!)

The React app is already configured with:
- ✅ Login page at `/login`
- ✅ Protected admin routes
- ✅ Authentication context
- ✅ Logout functionality

## Managing Access

### Adding New Users

1. Go to Cloudflare Zero Trust dashboard
2. Navigate to **Access** → **Applications**
3. Click on "Bethany SDA Admin Portal"
4. Edit the appropriate policy
5. Add the new user's email address
6. Click **Save**

The new user will have access within seconds!

### Removing Users

1. Go to the same policy
2. Remove their email address
3. Click **Save**

Their access will be revoked immediately.

### Checking Active Sessions

1. Go to **Logs** → **Access** in Zero Trust dashboard
2. View all authentication attempts and active sessions
3. You can force-revoke sessions if needed

## Roles and Permissions

### Site Owner (You and Pastor)
- Can add/remove users
- Can access all admin features
- Can view logs and analytics
- Full control over Cloudflare Access settings

### Church Staff (Optional)
- Can access admin portal
- Can edit content through admin interface
- Cannot add/remove other users
- Cannot change access settings

## Security Best Practices

1. **Use Strong Session Duration:**
   - 24 hours is good for active use
   - Shorter for higher security (e.g., 8 hours)

2. **Enable MFA:**
   - In Zero Trust settings, enable MFA requirement for all users

3. **Review Access Logs:**
   - Check logs monthly for suspicious activity

4. **Least Privilege:**
   - Only give admin access to those who need it

5. **Regular Audits:**
   - Review user list quarterly
   - Remove users who no longer need access

## Troubleshooting

### "Access Denied" Error
- Check if the user's email is in an allow policy
- Verify the email matches exactly (case-sensitive)
- Check if the identity provider is working

### "Too Many Redirects"
- Clear cookies and try again
- Check application domain configuration
- Verify no conflicting Page Rules

### User Can't Log In
- Verify they're using the correct Google/Microsoft account
- Check if their account is in the allow policy
- Make sure they're accessing through `/login` page

### Logout Not Working
- The logout redirects to `/cdn-cgi/access/logout`
- This is a Cloudflare Access endpoint that clears the session
- After logout, users must re-authenticate

## Cost

Cloudflare Access is **FREE** for:
- Up to 50 users
- Unlimited applications
- Basic identity providers (Google, Microsoft, etc.)

Perfect for a church with a small staff team!

## Support

If you need help:
- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)

## Next Steps

1. Complete the Cloudflare Access setup above
2. Test with your account
3. Add pastor's account
4. Test together
5. Add other staff members as needed
6. Document your team's custom domain and access URL for future reference
