# UK Legal Docs - Business Setup Guide

## What This Is

A complete, ready-to-deploy web application that generates GDPR-compliant legal documents for UK small businesses.

**Revenue Model:** £29 per document pack × 35 sales/month = £1,015/month

**Why This Works:**
- Every UK website legally needs these documents (GDPR requirement)
- Lawyers charge £300-800 for the same thing
- Existing generators are US-focused or subscription-based
- No SEO required - sell directly in UK business Facebook groups
- Zero ongoing costs (static HTML, host free on Netlify/Vercel)
- Zero maintenance (maybe annual legal review)

---

## Quick Start (5 Minutes)

### Option 1: Deploy to Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `index.html` file
4. Your site is live! Netlify gives you a URL like `random-name.netlify.app`
5. (Optional) Add a custom domain like `uklegaldocs.co.uk`

### Option 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Install Vercel CLI: `npm i -g vercel`
3. In this folder, run: `vercel`
4. Follow prompts - your site is live!

### Option 3: Any Static Host

This is a single HTML file - it works on any hosting:
- GitHub Pages (free)
- Cloudflare Pages (free)
- Any web host with FTP access

---

## Adding Payments

### Option A: Gumroad (Recommended - Easiest)

Gumroad handles everything: payments, delivery, customer support.

1. Create account at [gumroad.com](https://gumroad.com)
2. Create a product:
   - Name: "UK Legal Document Pack"
   - Price: £29
   - Type: "Digital product"
   - Description: Use the landing page copy
3. Get your Gumroad product link (like `gumroad.com/l/uklegaldocs`)
4. Replace the "Generate Documents" buttons in index.html to link to Gumroad

**How it works:**
- Customer pays on Gumroad
- Gumroad gives them access to a password-protected page
- You host the actual generator on a separate "hidden" URL
- OR: Create the docs manually and deliver as files via Gumroad

### Option B: Stripe Checkout

For direct payments (slightly more work):

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Create a Payment Link in Stripe Dashboard
3. Add the payment link to your site
4. After payment, redirect to a thank-you page with the generator

### Option C: LemonSqueezy

Similar to Gumroad but better for UK businesses:

1. Create account at [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create product, set price
3. Integrate checkout link

---

## Marketing (No SEO Required)

### Facebook Groups (Primary Channel)

Join and post in these groups (UK small business focused):

**General UK Business:**
- UK Small Business Owners
- UK Entrepreneurs & Start Ups
- Small Business UK
- UK Business Networking

**Trade-Specific:**
- UK Electricians
- Plumbers UK
- UK Builders and Tradesmen
- Self Employed UK

**Freelancers:**
- UK Freelancers
- Freelance Heroes UK
- UK Virtual Assistants

**Post Template:**
```
Quick question for anyone with a website - do you have a GDPR-compliant privacy policy?

I was shocked to learn the ICO can fine businesses up to £17.5m for not having proper policies. Lawyers charge £300-500+ to write them.

I've been using [your site] - it's £29 for all three documents (privacy policy, terms, cookies) specifically written for UK law. Took me 5 minutes.

Just thought I'd share in case anyone else was in the same boat!
```

### Reddit

Post in:
- r/UKPersonalFinance
- r/smallbusiness (UK posts welcome)
- r/Entrepreneur
- r/UKFreelance
- r/startups

### Product Hunt Launch

1. Create account at producthunt.com
2. Submit your product
3. Good for initial traffic spike

### Local Business Directories

- Add to UK business directories
- Local Chamber of Commerce networks

---

## Revenue Projections

**Conservative (Year 1):**
- Month 1-3: 10 sales/month = £290/month (building presence)
- Month 4-6: 20 sales/month = £580/month 
- Month 7-12: 35 sales/month = £1,015/month

**After establishing presence:**
- 50+ sales/month = £1,450+/month
- Ongoing - people constantly starting businesses

---

## Costs

**Setup costs:** £0
- Hosting: Free (Netlify/Vercel)
- Domain: ~£10/year (optional)
- Gumroad: Free until you sell

**Ongoing costs:**
- Gumroad fee: 10% + £0.35 per sale (only when you sell)
- Domain renewal: £10/year
- Total per £29 sale: ~£3.25 to Gumroad = £25.75 profit

---

## Legal Notes

The documents generated are templates based on ICO guidelines and UK GDPR requirements. The disclaimer in the app makes clear this is not legal advice.

For your own protection:
1. Keep the disclaimer visible
2. Don't claim to be lawyers
3. Recommend users seek legal advice for complex situations
4. Annual review of templates against ICO guidance

---

## Customisation

### Changing Pricing

Edit the landing page to show your price. Search for "£29" in index.html.

### Changing Business Name

Search and replace "UK Legal Docs" with your brand name.

### Adding More Documents

The generator can be extended to create:
- GDPR Data Processing Agreements
- Employee Privacy Notices
- Subject Access Request templates

---

## Support

The app is entirely self-contained in a single HTML file. No server, no database, no dependencies.

If something breaks, just redeploy the original file.

---

## Files in This Package

```
uk-legal-docs/
├── index.html      # The complete application
├── README.md       # This file
└── vercel.json     # Vercel deployment config (optional)
```

---

## Summary

1. Deploy index.html to free host (5 mins)
2. Set up Gumroad product (10 mins)  
3. Post in 10 Facebook groups (30 mins)
4. Wait for sales

Total setup time: ~45 minutes
Ongoing work: Post in groups weekly, respond to occasional questions
Expected return: £500-1000+/month within 3-6 months
