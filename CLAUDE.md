# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UK Legal Docs is a client-side legal document generator SaaS for UK businesses. It generates GDPR-compliant Privacy Policies, Terms of Service, and Cookie Policies based on a 5-step questionnaire. The entire application is contained in a single `index.html` file with no build system or external dependencies.

## Development

**No build step required.** Open `index.html` directly in a browser for development.

**Deployment:**
```bash
# Netlify (recommended)
netlify deploy --prod

# Vercel
vercel
```

Both `netlify.toml` and `vercel.json` are pre-configured for SPA routing.

## Architecture

### Single-File Structure

All HTML, CSS (~600 lines), and JavaScript (~780 lines) are in `index.html`. The `src/` directory exists but is empty.

### Application Flow

```
Landing Page → startApp() → 5-Step Form → generateDocs() → Document Viewer
```

### Key JavaScript Functions

**Form Navigation:**
- `startApp()` - Transitions from landing page to form
- `nextStep()` / `prevStep()` - Form step navigation
- `showStep(step)` - Renders specific step
- `updateProgress()` - Updates progress bar UI

**Data & Generation:**
- `collectFormData()` - Gathers form inputs into global `formData` object
- `generatePrivacyPolicy()` - Template-based privacy policy with conditional sections
- `generateTermsOfService()` - Adapts to business type (e-commerce, SaaS, service)
- `generateCookiePolicy()` - Conditional on cookie usage selection

**Output:**
- `showDoc(docType)` - Switches between privacy/terms/cookies tabs
- `copyDoc()` - Clipboard API
- `downloadDoc()` - Blob API download as .doc file

### Global State

```javascript
currentStep      // Current form step (1-5)
totalSteps       // Always 5
formData         // User input object
currentDoc       // Active tab: 'privacy' | 'terms' | 'cookies'
generatedDocs    // Generated HTML for each document type
```

### Form Steps

1. **Business Basics** - Name, website, email, address
2. **Business Type** - Category, description, customer type (B2C/B2B)
3. **Data Collection** - Personal data types, collection methods
4. **Third Parties & Cookies** - Analytics, payments, email services, cookie usage
5. **Additional Options** - Marketing, accounts, UGC, minors

### Document Generation

Documents use template literals with conditional sections based on `formData`. Each generator function returns HTML string with UK law-specific language and GDPR compliance sections.

## Styling

CSS uses custom properties for theming:
- `#1e3a5f` (navy) - primary color
- `#c9a227` (gold) - accent color
- `#faf8f5` (cream) - background

Fonts: Source Serif 4 (headings), Inter (body) via Google Fonts CDN.

## When Modifying

- All changes go in `index.html` - there's no modular file structure
- Document templates are in the `generate*()` functions - search for `generatePrivacyPolicy`, `generateTermsOfService`, `generateCookiePolicy`
- Form field additions require updates to both HTML (form structure) and `collectFormData()` function
- Adding new document sections requires modifying the relevant template function's conditional logic
