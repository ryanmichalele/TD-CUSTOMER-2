# Sanity → Netlify Auto-Deploy Setup Guide

## 1. Create Netlify Build Hook

1. Go to **Netlify Dashboard** → Your site → **Site settings** → **Build & deploy** → **Build hooks**
2. Click **Add build hook**
3. Name: `Sanity Publish`
4. Branch: `main` (or your production branch)
5. Click **Save**
6. **Copy the webhook URL** (looks like: `https://api.netlify.com/build_hooks/abc123xyz`)

## 2. Create Sanity Webhook

1. Go to **Sanity Manage** → Your project (`e9j72tow`) → **API** → **Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Name**: `Netlify Auto-Deploy`
   - **URL**: Paste the Netlify build hook URL from step 1
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Filter**: `_type in ["dashboardAccount", "taxReport"]`
   - **Projection** (optional, for smaller payload):
     ```
     {
       _type,
       _id,
       _updatedAt
     }
     ```
   - **Secret**: (optional but recommended) Generate a random string
4. Click **Create**

## 3. Add Environment Variables to Netlify

Go to **Netlify Dashboard** → Site settings → **Environment variables** → Add:

| Key | Value |
|-----|-------|
| `SANITY_PROJECT_ID` | `e9j72tow` |
| `SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | `skCyj1JLFhPFkXq0cscDe2FvEAJOvltih7EiBpPQsw9UsAfMs6MbaDAYvXhO47dpCuGuqwmZrI4d2oU9icpd1MFejvO6P2T1T5uCwxkHmKMhOewy5mwbjRm1zw1pLZRuLxSqBFpxmjQgEr9NebgAjjtnSH8ro5CE5M2KFId7G6dUvKxY5sBN` |

## 4. Test the Integration

1. **Local test**: Run `npm run dev` in `/studio` and edit content at `http://localhost:3333`
2. **Publish** a change in Sanity Studio
3. Check Netlify **Deploys** tab - should trigger a new build within 1-2 minutes
4. Visit live site → changes should be visible

## 5. Preview Mode (Draft Content)

To preview unpublished drafts:
- Add `?preview=true` to any page URL
- Example: `https://your-site.netlify.app/dashboard/?preview=true`
- Requires `SANITY_API_TOKEN` with viewer permissions

## 6. CORS Settings (if needed)

If you get CORS errors locally:
1. Sanity Manage → API → **CORS origins**
2. Add: `http://localhost:3000`, `http://localhost:3333`, `https://your-site.netlify.app`
3. Allow credentials: **No** (unless using auth)

## 7. Local Development with Netlify Functions

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Run local dev with functions
netlify dev
```

This will proxy `/.netlify/functions/*` to your local functions.

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| Build not triggering | Check Sanity webhook delivery logs (API → Webhooks → click webhook → Deliveries) |
| Function errors | Check Netlify Functions logs (Dashboard → Functions → get-dashboard) |
| Stale data | Clear Netlify cache: Dashboard → Deploys → Trigger deploy → Clear cache and deploy |
| Preview not working | Verify `SANITY_API_TOKEN` has "Viewer" role in Sanity API settings |

## 9. Files Created

| File | Purpose |
|------|---------|
| `netlify/functions/get-dashboard.mjs` | Fetches dashboardAccount from Sanity |
| `netlify/functions/get-tax-report.mjs` | Fetches taxReport from Sanity |
| `studio/schemas/taxReport.js` | Sanity schema for 1099 tax forms |
| `scripts/sanity-seed-taxreport.mjs` | Seeds initial tax report data |
| `dashboard/index.html` | Updated to fetch/populate from API |
| `1099/index.html` | Updated to fetch/populate from API |

## 10. Next Steps (Optional)

- Add more schemas: `auctionSchedule`, `bondRate`, `helpArticle`, `newsPost`
- Create corresponding Netlify functions
- Update other pages (`/auctions/`, `/help-center/`, `/news/`, etc.)
- Add ISR (Incremental Static Regeneration) for better performance
- Set up Sanity GROQ webhooks for granular cache invalidation