# Snipcart Configuration Guide for Bea's Delicacies

## Overview
Your website is now using **Snipcart v3.7.1** as the complete e-commerce checkout solution. The duplicate custom checkout system has been removed.

## Current Implementation Status

### ✅ Completed
- Snipcart integration on all product pages
- Custom theme styling matching your brand colors
- Mobile touch target optimization (48px minimum)
- Guest checkout enabled
- Free shipping threshold messaging ($50+)
- Country field CSS fixes (z-index and width)
- SSL security badges
- Payment method logos
- Trust signals

### ⚠️ Configuration Required

The following items need to be configured in your **Snipcart Dashboard** at: https://app.snipcart.com

---

## 1. API Key Configuration

**Current API Key:** `YTU1ZTc4NjYtODk0MS00ZTEzLTk4MTMtMjg3NDBiMDBhMjBhNjM4OTc5MDMxMjc4NDQyNzYz`

### Action Required:
1. Log in to https://app.snipcart.com
2. Verify this is your **PUBLIC API key** (Test or Live)
3. **Important:** Confirm you're using the correct mode:
   - **Test Mode:** For development/testing (test credit cards work)
   - **Live Mode:** For production (real transactions)

**Files containing API key:**
- `/html/checkout.html` (line 530)
- `/html/shop.html` (line 565)

---

## 2. Payment Gateway Setup

Your site advertises these payment methods. Configure them in Snipcart:

### Required Payment Gateways:

#### Stripe (Credit Cards)
- Dashboard: Account → Payment Gateways → Stripe
- Enable: Visa, Mastercard, Amex
- Required: Stripe publishable key + secret key
- Get keys: https://dashboard.stripe.com/apikeys

#### PayPal
- Dashboard: Account → Payment Gateways → PayPal
- Enable PayPal Checkout
- Required: PayPal Business account

#### Apple Pay
- Dashboard: Account → Payment Gateways → Stripe → Apple Pay
- Requires: SSL certificate + domain verification
- Platform: iOS Safari only

#### Google Pay
- Dashboard: Account → Payment Gateways → Stripe → Google Pay
- Requires: Stripe account setup
- Platform: Chrome/Android

---

## 3. Shipping Configuration

Your site displays: **"Free shipping on orders over $50!"**

### Action Required:
1. Go to: Dashboard → Shipping → Rates
2. Create shipping rule:
   ```
   Name: Standard Shipping
   Rate Type: Flat rate
   Amount: $8.99
   ```
3. Create free shipping rule:
   ```
   Name: Free Shipping
   Rate Type: Flat rate
   Amount: $0.00
   Condition: Order total >= $50.00
   ```

### Additional Shipping Options:
- Geographic restrictions (U.S. only?)
- Weight-based shipping
- Carrier-calculated rates

---

## 4. Tax Configuration

Your site shows: **"Tax (10%)"**

### Action Required:
1. Go to: Dashboard → Taxes
2. Configure tax rates by region:
   - U.S. sales tax varies by state
   - Set up automatic tax calculation via TaxJar (recommended)
   - Or manually configure rates per state

**Recommendation:** Use TaxJar integration for accurate U.S. sales tax compliance.

---

## 5. Domain & CORS Setup

### Action Required:
1. Go to: Dashboard → Account → Domains
2. Add your domain: `beasdelicacies.com` (or your actual domain)
3. Verify SSL certificate is active
4. Add allowed domains for CORS

**Note:** Snipcart won't work on `localhost` or `file://` URLs without proper domain configuration.

---

## 6. Email Notifications

### Customer Emails:
- Order confirmation
- Shipping notification
- Password reset

### Merchant Emails:
- New order notification
- Inventory alerts

### Action Required:
1. Go to: Dashboard → Settings → Email Notifications
2. Customize email templates with your branding
3. Set merchant notification email: `hello@beasdelicacies.com`
4. Test all email types

---

## 7. Guest Checkout Settings

### Current Implementation:
Your site prominently displays guest checkout options.

### Action Required:
1. Go to: Dashboard → Settings → Customer Accounts
2. Ensure **"Allow guest checkout"** is enabled
3. Optional: Enable account creation after checkout

---

## 8. Currency & Regional Settings

### Action Required:
1. Go to: Dashboard → Settings → Regional
2. Set currency: **USD** (United States Dollar)
3. Set number format: **1,234.56**
4. Set date format: **MM/DD/YYYY** (U.S. standard)
5. Set timezone

---

## 9. Inventory Management

### Action Required (Optional):
1. Go to: Dashboard → Products
2. For each product, set:
   - Stock quantity
   - Track inventory: Yes/No
   - Allow backorders: Yes/No

**Product IDs in your code:**
- `vanilla-cupcakes-dozen` - $30.00
- `chocolate-cake` - $45.00
- `croissants-half-dozen` - $18.00
- `chocolate-chip-cookies` - $24.00

---

## 10. Custom Fields & Checkout Flow

### Recommended Custom Fields:
1. Go to: Dashboard → Settings → Custom Fields
2. Add fields like:
   - Delivery instructions
   - Gift message
   - Preferred delivery date
   - Dietary restrictions/allergies

---

## 11. Test Your Checkout

### Test Mode Checklist:
- [ ] Add item to cart
- [ ] Open cart modal
- [ ] Verify guest checkout works
- [ ] Test credit card: `4242 4242 4242 4242` (Stripe test card)
- [ ] Verify free shipping applies at $50+
- [ ] Verify tax calculation
- [ ] Check order confirmation email
- [ ] Verify country dropdown works (no overlap)
- [ ] Test on mobile (touch targets 48px+)
- [ ] Test PayPal integration
- [ ] Test Apple Pay (if available)

---

## 12. Production Deployment Checklist

Before going live:
- [ ] Switch from Test API key to Live API key
- [ ] Update API key in `/html/checkout.html` line 530
- [ ] Update API key in `/html/shop.html` line 565
- [ ] Verify Stripe live keys configured
- [ ] Verify PayPal production mode
- [ ] Test real purchase with small amount
- [ ] Verify merchant email notifications working
- [ ] Verify SSL certificate valid
- [ ] Check all payment methods functional
- [ ] Review refund/return policy page

---

## Snipcart Dashboard Navigation

**Dashboard URL:** https://app.snipcart.com

### Key Sections:
- **Orders:** View and manage orders
- **Customers:** Customer database
- **Products:** Not used (products defined in HTML)
- **Abandoned Carts:** Recovery tools
- **Analytics:** Sales reports
- **Settings:**
  - Payment Gateways
  - Shipping
  - Taxes
  - Email Templates
  - Custom Fields
  - Domains
  - API Keys

---

## Product Configuration

Products are defined in your HTML using `data-item-*` attributes:

```html
<button
  class="btn snipcart-add-item"
  data-item-id="vanilla-cupcakes-dozen"
  data-item-price="30.00"
  data-item-url="/shop.html"
  data-item-description="A dozen of our classic vanilla cupcakes"
  data-item-image="images/cupcakes.jpg"
  data-item-name="Classic Vanilla Cupcakes (Dozen)">
  Add to Cart
</button>
```

### To Add New Products:
1. Add product to `/html/shop.html`
2. Use same `data-item-*` attributes
3. Ensure `data-item-url` points to the page
4. Use unique `data-item-id`

---

## Styling Customization

All Snipcart styling is in:
- `/html/checkout.html` (lines 14-322)
- `/html/shop.html` (lines 16-360)

### Brand Colors Used:
- Primary: `#C9A886` (soft tan)
- Secondary: `#D4B896` (light tan)
- Accent: `#B89968` (golden tan)
- Dark: `#8B7355` (warm brown)
- Background: `#FAF7F2` (cream)
- Text: `#4A4A4A` (warm gray)

---

## Security & Compliance

### SSL Certificate:
- **Required** for Snipcart to function
- **Required** for Apple Pay
- **Required** for Google Pay
- Displays security badge in footer

### PCI Compliance:
- Snipcart is PCI DSS Level 1 compliant
- Never store credit card numbers yourself
- All payment data handled by Stripe/PayPal

---

## Support Resources

- **Snipcart Documentation:** https://docs.snipcart.com
- **Snipcart Support:** support@snipcart.com
- **Stripe Documentation:** https://stripe.com/docs
- **PayPal Documentation:** https://developer.paypal.com

---

## Mobile Optimization

### Touch Targets (Completed):
All buttons and inputs now meet the **48px minimum** touch target size:
- All `.btn` buttons: 48px min-height
- All form inputs: 48px min-height
- All Snipcart buttons: 48px min-height
- Navigation links on mobile: 48px min-height

This meets WCAG 2.1 Level AAA accessibility standards.

---

## Files Modified in This Update

1. `/html/checkout.html` - Removed duplicate custom form, added touch targets
2. `/html/shop.html` - Added touch target optimizations
3. `/html/style.css` - Added mobile touch target CSS rules
4. `/html/checkout.js` - **No longer used** (can be deleted)

---

## Next Steps

1. **Immediate:**
   - [ ] Log in to Snipcart Dashboard
   - [ ] Verify API key mode (Test vs Live)
   - [ ] Configure payment gateways

2. **Before Launch:**
   - [ ] Set up shipping rates
   - [ ] Configure tax collection
   - [ ] Test complete checkout flow
   - [ ] Customize email templates

3. **Post-Launch:**
   - [ ] Monitor orders in dashboard
   - [ ] Set up abandoned cart recovery
   - [ ] Review analytics weekly

---

## Questions or Issues?

If you encounter issues:
1. Check browser console for errors
2. Verify API key is correct
3. Ensure domain is whitelisted in Snipcart
4. Check CORS settings
5. Contact Snipcart support if needed

---

**Last Updated:** 2025-11-05
**Snipcart Version:** v3.7.1
**Website:** Bea's Delicacies
