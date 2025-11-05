# Snipcart Integration Setup Guide

This guide will help you complete the Snipcart integration for Bea's Delicacies.

## What Was Done

Snipcart checkout has been integrated into the following pages:
- `html/shop-updated.html` - Main shop page with product listings
- `html/index.html` - Home page
- `html/about.html` - About page
- `html/contact.html` - Contact page

### Changes Made:
1. Added Snipcart CSS and JavaScript libraries
2. Updated "Add to Cart" buttons with Snipcart data attributes
3. Replaced cart link with Snipcart cart button
4. Added custom CSS to match your existing theme
5. Commented out the old `cart.js` script (no longer needed)

## Setup Instructions

### Step 1: Create a Snipcart Account

1. Go to [https://snipcart.com](https://snipcart.com)
2. Sign up for a free account (Test mode is free forever, Live mode has transaction fees)
3. Once logged in, go to your Dashboard

### Step 2: Get Your API Key

1. In your Snipcart dashboard, navigate to **Account** → **API Keys**
2. You'll see two keys:
   - **Test Public API Key** (for testing)
   - **Live Public API Key** (for production)
3. Copy your **Test Public API Key** first to test the integration

### Step 3: Add Your API Key to the Website

Replace `YOUR_PUBLIC_API_KEY_HERE` with your actual API key in these files:

- `html/shop-updated.html` (line 166)
- `html/index.html` (line 247)
- `html/about.html` (line 240)
- `html/contact.html` (line 248)

Look for this line in each file:
```html
<div id="snipcart" data-api-key="YOUR_PUBLIC_API_KEY_HERE" data-config-modal-style="side" hidden></div>
```

Replace it with:
```html
<div id="snipcart" data-api-key="your-actual-api-key-here" data-config-modal-style="side" hidden></div>
```

### Step 4: Configure Snipcart Settings

In your Snipcart dashboard:

1. **Domain & URLs**
   - Add your website domain (e.g., `beasdelicacies.com`)
   - Add localhost for testing: `http://localhost` or `http://127.0.0.1`

2. **Payment Gateway**
   - Connect your payment processor (Stripe, PayPal, etc.)
   - Configure your payment settings

3. **Shipping**
   - Set up shipping rates
   - Configure free shipping threshold ($50 as mentioned on your site)

4. **Taxes**
   - Configure tax rates for your region
   - The current site shows 10% tax

### Step 5: Test the Integration

1. Open `shop-updated.html` in your browser
2. Click "Add to Cart" on a product
3. The Snipcart cart should slide in from the side
4. Try adding items, updating quantities, and going through checkout
5. Use Snipcart test credit card: `4242 4242 4242 4242`

### Step 6: Go Live

Once testing is complete:

1. Replace the Test API Key with your Live Public API Key
2. Ensure your payment gateway is configured for live transactions
3. Test with a small real transaction

## Theme Customization

The Snipcart cart has been styled to match your existing theme:
- Colors: Soft tan/beige (#C9A886), warm brown (#8B7355)
- Fonts: 'Playfair Display' for headings, 'Montserrat' for body text
- Buttons: Gradient backgrounds with rounded corners

You can further customize the cart appearance by editing the `<style>` block in the `<head>` section of each page.

## Rollback Instructions

If you need to revert to the previous cart system:

### Option 1: Using Git (Recommended)

```bash
# Switch back to main branch
git checkout main

# Delete the snipcart-integration branch (optional)
git branch -D snipcart-integration
```

### Option 2: Manual Rollback

1. Restore the original cart link in navigation:
   ```html
   <li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
   ```

2. Uncomment the cart.js script:
   ```html
   <script src="cart.js"></script>
   ```

3. Remove Snipcart scripts and CSS from all pages
4. Change buttons back to links:
   ```html
   <a href="#" class="btn">Add to Cart</a>
   ```

## Support

- Snipcart Documentation: [https://docs.snipcart.com](https://docs.snipcart.com)
- Snipcart Support: support@snipcart.com
- Community Forum: [https://community.snipcart.com](https://community.snipcart.com)

## Notes

- The old `cart.html` and `cart.js` files are still in the repository but are not being used
- The `auth.js` script has been commented out but can be re-enabled if needed for login functionality
- Snipcart handles all cart management, checkout, and order processing
- You'll receive email notifications for new orders
- Customers will receive order confirmation emails automatically
