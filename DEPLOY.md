# 🚀 Quick Deploy Guide

## Fastest Way: Netlify Drag & Drop (5 minutes)

### Step 1: Build Your App
```bash
npm run build
```
This creates a `dist` folder with your compiled app.

### Step 2: Deploy to Netlify
1. Go to: **https://app.netlify.com/drop**
2. Drag your `dist` folder onto the page
3. Wait 30 seconds
4. Get your link: `https://random-name.netlify.app`

### Step 3: (Optional) Custom Name
1. Click "Site settings"
2. Click "Change site name"
3. Enter: `rsa-crypto-lab`
4. New URL: `https://rsa-crypto-lab.netlify.app`

**Done! Your site is live 24/7! 🎉**

---

## Alternative: Deploy with GitHub (Auto-deploy on changes)

### Step 1: Create GitHub Repository
1. Go to **https://github.com/new**
2. Name: `rsa-lab`
3. Keep public
4. Don't initialize with README
5. Click "Create repository"

### Step 2: Push Your Code
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "RSA Virtual Lab - Initial deployment"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rsa-lab.git

# Push
git branch -M main
git push -u origin main
```

### Step 3: Connect to Netlify
1. Go to **https://app.netlify.com/**
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your `rsa-lab` repository
5. Settings should auto-fill:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Step 4: Wait for Deployment
- First deploy: 1-2 minutes
- You'll get a URL like: `https://random-name.netlify.app`

**Now every GitHub push auto-deploys!** ✨

---

## Update Your Deployed Site

### If using Drag & Drop:
```bash
# Make changes to your code
npm run build
# Drag new dist folder to Netlify dashboard
```

### If using GitHub:
```bash
# Make changes to your code
git add .
git commit -m "Updated UI"
git push
# Auto-deploys in 1-2 minutes!
```

---

## Troubleshooting

### Build Failed?
Check that `netlify.toml` exists in your project root (it should be there now!)

### Site loads but shows 404 on refresh?
The `netlify.toml` file fixes this automatically.

### Need help?
Run these commands and share the output:
```bash
npm --version
node --version
npm run build
```

---

## Your Deployment URLs

After deploying, fill these in:

- **Netlify URL:** `https://______.netlify.app`
- **GitHub Repo:** `https://github.com/______/rsa-lab`
- **Custom Domain (if any):** `https://______.com`

---

## Cost: $0.00 Forever

All these services are **100% free** for projects like this:
- ✅ Netlify: 100GB bandwidth/month (more than enough)
- ✅ GitHub: Unlimited public repos
- ✅ No credit card required
- ✅ No time limits
- ✅ Always online (doesn't need your computer running)

---

## Questions?

1. **How long does it stay online?** Forever (until you manually delete it)
2. **Do I need to keep my computer on?** No! It runs on Netlify's servers
3. **Can I use a custom domain?** Yes! Add it in Netlify settings
4. **How do I update it?** Just push to GitHub (if connected) or drag-drop new build
5. **Is it secure?** Yes! HTTPS is automatic

---

**Ready? Let's deploy!** 🚀

```bash
npm run build
```

Then drag `dist` to https://app.netlify.com/drop
