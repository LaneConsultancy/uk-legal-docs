# Handoff: Trust & CRO Improvements for UK Legal Docs

## Context

Analysis completed on the landing page (`index.html`) to identify trust-building and conversion rate optimisation opportunities. The site is a single-file SPA that generates GDPR-compliant legal documents for UK businesses (£29 one-time payment).

## Current State

- Single `index.html` file (~1,580 lines) containing all HTML, CSS, and JS
- Landing page → 5-step form → Document output
- No payment integration yet (placeholder CTA buttons)
- No analytics or tracking implemented

---

## Implementation Plan

### Phase 1: Critical Trust Elements (Highest Impact)

#### 1.1 Add Money-Back Guarantee Badge
**Location:** Near hero CTA and final CTA section
**Implementation:**
- Add a "30-Day Money-Back Guarantee" badge/text below the price button
- Style consistently with existing trust bar (green checkmark)

```html
<!-- Add after .hero-price div -->
<p class="guarantee">✓ 30-Day Money-Back Guarantee — No Questions Asked</p>
```

#### 1.2 Add Testimonials Section
**Location:** Between "How It Works" and FAQ sections
**Implementation:**
- Create new section with 3 testimonial cards
- Include: quote, name, business type, optional photo placeholder
- Use real testimonials once available, or mark as placeholder

**Structure:**
```html
<section class="testimonials">
  <h2 class="section-title">Trusted by UK Business Owners</h2>
  <div class="testimonials-grid">
    <!-- 3 testimonial cards -->
  </div>
</section>
```

#### 1.3 Add "See Sample Document" Link
**Location:** Hero section, near CTA
**Implementation:**
- Add link that opens modal with redacted sample Privacy Policy
- Shows quality without giving away full product
- Modal should have close button and CTA to generate own docs

#### 1.4 Remove or Verify "2,400+ businesses" Claim
**Decision needed:** Either:
- A) Replace with real, verifiable number
- B) Remove entirely and replace with different social proof
- C) Change to softer claim: "Trusted by UK businesses"

---

### Phase 2: Copy Improvements

#### 2.1 Hero Section Rewrites

**Current headline:**
> "Professional Legal Documents for Your Website — Without the Lawyer Fees"

**Option A (Speed focus):**
> "Legal Documents for Your UK Website — Done in 5 Minutes, Not 5 Hours"

**Option B (Simplicity focus):**
> "Get Your Website's Legal Documents Sorted — Today"

**Current sub-copy:**
> "Generate GDPR-compliant Privacy Policies, Terms of Service, and Cookie Policies in minutes. Tailored to UK law. Used by 2,400+ businesses."

**Recommended:**
> "Answer 5 simple questions. Get all three legal documents your UK website needs — professionally written, GDPR-compliant, and ready to publish."

#### 2.2 Badge Update

**Current:** `🇬🇧 Built for UK businesses`

**Better options:**
- `🇬🇧 Updated for 2025 UK Regulations`
- `🇬🇧 UK Law Compliant • ICO Guidelines`

#### 2.3 Section Title Updates

| Current | Recommended |
|---------|-------------|
| "Everything You Need to Be Legally Compliant" | "Three Documents. One Price. Zero Legal Headaches." |
| "Ready in 5 Minutes" | "How It Works" (keep simple) |
| "Stop Risking Fines. Get Compliant Today." | "Your Documents Cost £29. ICO Fines Start at £500." |

#### 2.4 CTA Button Text

**Current:** "Generate Your Documents — £29"

**Options:**
- "Get Protected Now — £29"
- "Create My Legal Docs — £29"
- "Get All 3 Documents — £29"

---

### Phase 3: UX Improvements

#### 3.1 Add Sticky CTA Button
**Implementation:**
- Show floating CTA button when user scrolls past hero
- Disappears when footer/final CTA is in view
- Mobile: full-width bar at bottom

```css
.sticky-cta {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
  display: none; /* JS controls visibility */
}
```

#### 3.2 FAQ Accordion
**Implementation:**
- Collapse FAQ answers by default
- Click question to expand/collapse
- Reduces visual overwhelm
- Add chevron icon indicator

#### 3.3 Add Expertise Proof
**Location:** Trust bar or new "Why Trust Us" micro-section
**Copy options:**
- "Templates based on ICO guidance and UK GDPR requirements"
- "Reviewed by UK data protection specialists"
- "Updated whenever UK regulations change"

#### 3.4 Add Payment Trust Signals
**Location:** Near CTAs, in footer
**Implementation:**
- Add Stripe/card logos when payment is integrated
- "Secure payment" text with lock icon

---

### Phase 4: Structural Changes

#### 4.1 Reorganise Features Section
**Current:** 6 mixed cards (3 documents + 3 process benefits)

**Recommended split:**

**Section A: "What You Get"**
- Privacy Policy
- Terms of Service
- Cookie Policy

**Section B: "Why UK Legal Docs"**
- Instant Download
- Tailored to You
- Always Up-to-Date

#### 4.2 Add Price Comparison Table
**Location:** After "How It Works" or before FAQ
**Content:**
| | Free Generators | UK Legal Docs | Solicitor |
|---|---|---|---|
| Price | £0 | £29 | £300-800 |
| UK Law Specific | ❌ | ✓ | ✓ |
| Tailored to Business | ❌ | ✓ | ✓ |
| Instant | ✓ | ✓ | ❌ |
| Free Updates | ❌ | ✓ | ❌ |

---

## File Changes Summary

All changes are in `index.html`:

| Line Range (approx) | Section | Changes |
|---------------------|---------|---------|
| 641-654 | Hero | Update headline, sub-copy, add guarantee |
| 657-676 | Trust Bar | Consider adding expertise proof |
| 678-733 | Features | Split into two sections |
| 737-760 | How It Works | (minor copy tweaks) |
| NEW | Testimonials | Add new section after How It Works |
| 763-798 | FAQ | Add accordion JS functionality |
| 801-809 | Final CTA | Update copy, add guarantee |
| 812-815 | Footer | Add payment logos placeholder |
| CSS section | Styles | Add .sticky-cta, .testimonials, .guarantee, accordion styles |
| JS section | Scripts | Add sticky CTA scroll handler, FAQ accordion toggle |

---

## Testing Checklist

After implementing changes:

- [ ] All CTAs still trigger `startApp()` correctly
- [ ] Mobile responsive (test at 375px, 768px widths)
- [ ] FAQ accordion expands/collapses properly
- [ ] Sticky CTA appears/hides at correct scroll positions
- [ ] Sample document modal opens/closes
- [ ] No console errors
- [ ] Page still works as single file (no external dependencies added)

---

## Assets Needed

1. **Testimonials:** 3 real customer quotes (or placeholder text)
2. **Sample document:** Redacted example Privacy Policy content
3. **Payment logos:** Stripe, Visa, Mastercard SVGs (when payment ready)
4. **Headshot photos:** Optional, for testimonials

---

## Priority Order for Implementation

1. **Quick wins (30 mins):** Copy changes (headlines, CTA text, badge)
2. **Medium effort (1-2 hours):** Guarantee badge, expertise proof, FAQ accordion
3. **Higher effort (2-3 hours):** Testimonials section, sample document modal, sticky CTA
4. **Future:** Price comparison table, payment trust signals (when Stripe integrated)

---

## Notes

- Keep everything in single `index.html` file — no build system
- Test in Chrome and Safari minimum
- The "2,400+ businesses" claim should be addressed before any marketing push
- Consider A/B testing headline variants once traffic exists
