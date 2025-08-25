# 🚀 Cloudflare Pages Deployment Guide for Math Learning Adventure

## Quick Setup Instructions

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Connect to GitHub**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select the `mathahorn` repository

2. **Build Configuration**:
   ```
   Build command: npm run build
   Build output directory: out
   Root directory: (leave empty)
   ```

3. **Environment Variables** (Optional):
   ```
   NODE_VERSION=18
   ENVIRONMENT=production
   ```

4. **Deploy**:
   - Click "Save and Deploy"
   - Your Math Learning Adventure will be live at `https://mathahorn.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

## Build Commands

```bash
# Development server
npm run dev

# Build for production (static export)
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Preview locally with Wrangler
npm run preview
```

## Configuration Files

- `next.config.ts` - Next.js configuration for static export
- `wrangler.toml` - Cloudflare Pages configuration
- `_headers` - HTTP headers for security and caching
- `_redirects` - SPA routing configuration

## Features Optimized for Cloudflare

✅ **Static Export**: Optimized for Cloudflare Pages static hosting  
✅ **Image Optimization**: Configured for static assets  
✅ **Security Headers**: Enhanced security configuration  
✅ **Caching**: Optimized cache policies for performance  
✅ **SPA Routing**: Proper routing for client-side navigation  

## Domain Setup (Optional)

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain (e.g., `mathahorn.com`)
4. Cloudflare will automatically provision SSL certificates

## Performance Optimizations

- **Static Assets**: Cached for 1 year
- **Images**: Optimized and cached
- **Gzip Compression**: Enabled by default
- **HTTP/2**: Automatically enabled
- **Global CDN**: Distributed worldwide

## Monitoring

- **Analytics**: Available in Cloudflare Pages dashboard
- **Real User Monitoring**: Built-in performance metrics
- **Error Tracking**: View deployment logs and errors

## Custom Domain Example

Once deployed, you can access your Math Learning Adventure at:
- Default: `https://mathahorn.pages.dev`
- Custom domain: `https://mathahorn.com` (if configured)

## Troubleshooting

**Build Errors**: Check that all dependencies are in `package.json`
**Routing Issues**: Verify `_redirects` file is in the output directory
**Performance**: Use Cloudflare's analytics to monitor loading times

Your Math Learning Adventure is now ready for global deployment! 🌍🎯