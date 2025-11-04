# Stripe Checkout Setup Guide for Beas Delicacies

This guide will walk you through setting up Stripe Checkout for your bakery e-commerce site.

## 🎯 What You'll Get

- Secure payment processing via Stripe
- Accept credit cards, Apple Pay, Google Pay
- Professional checkout experience
- Automatic email receipts
- Mobile-responsive payment forms
- PCI compliance handled by Stripe

## 📋 Prerequisites

1. A Stripe account (free to create)
2. A Netlify account (for hosting and serverless functions)
3. Your website files deployed

## 🚀 Step-by-Step Setup

### Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create an account
3. Complete the business verification (can start with test mode immediately)

### Step 2: Get Your Stripe API Keys

1. Log into your Stripe Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Click "Developers" in the top navigation
3. Click "API keys" in the left sidebar
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
5. **Important:** Keep your Secret key private! Never commit it to GitHub.

### Step 3: Deploy to Netlify

#### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [https://app.netlify.com](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub account and select your repository
5. Configure build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `html`
   - **Functions directory:** `netlify/functions`
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Step 4: Configure Environment Variables in Netlify

1. In your Netlify dashboard, go to your site
2. Click "Site configuration" > "Environment variables"
3. Add these variables:

   ```
   STRIPE_SECRET_KEY = sk_test_your_secret_key_here
   ```

4. Click "Save"

**Important:** Start with test keys (prefix `sk_test_` and `pk_test_`). Switch to live keys when ready to accept real payments.

### Step 5: Update Your Checkout Configuration

1. Open `html/checkout.js`
2. Find line 7 where it says:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
   ```
3. Replace `'pk_test_YOUR_PUBLISHABLE_KEY_HERE'` with your actual Stripe publishable key
4. Commit and push this change

### Step 6: Test the Integration

#### Using Test Cards

Stripe provides test card numbers for testing:

- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

For all test cards:
- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVV (e.g., 123)
- Use any ZIP code (e.g., 12345)

#### Test the Flow

1. Go to your deployed site
2. Add products to cart
3. Go to checkout
4. Fill in the form
5. Click "Place Order"
6. You should be redirected to Stripe Checkout
7. Use a test card number
8. Complete the payment
9. You should be redirected to the success page

### Step 7: Monitor Orders in Stripe Dashboard

1. Go to [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
2. You'll see all successful payments
3. Click on any payment to see details

## 🎨 Customization

### Update Product Prices

Products are currently hard-coded in `html/shop.html`. Prices are automatically sent to Stripe when customers checkout.

### Modify Shipping Costs

Edit the shipping calculation in `html/cart.js` and `html/checkout.js`:

```javascript
const shippingThreshold = 50;  // Free shipping threshold
const shipping = subtotal >= shippingThreshold ? 0 : 8.99;  // Shipping cost
```

### Tax Configuration

Currently set to 10% in the code. To use Stripe Tax (automatic tax calculation):

1. Enable Stripe Tax in your dashboard
2. Uncomment this line in `netlify/functions/create-checkout-session.js`:
   ```javascript
   automatic_tax: { enabled: true },
   ```

## 💳 Processing Fees

Stripe charges:
- **2.9% + $0.30** per successful transaction
- No monthly fees
- No setup fees
- No hidden costs

Example:
- $30 order = $1.17 fee
- $50 order = $1.75 fee
- $100 order = $3.20 fee

## 🔒 Security

✅ Your site is PCI compliant (Stripe handles sensitive data)
✅ Customer card details never touch your server
✅ SSL encryption required (free with Netlify)
✅ Fraud detection built-in

## 🔴 Going Live

When ready to accept real payments:

1. Complete your Stripe account activation
2. Get your **live** API keys from Stripe Dashboard
3. Update environment variables in Netlify:
   - Replace `sk_test_...` with `sk_live_...`
4. Update `html/checkout.js`:
   - Replace `pk_test_...` with `pk_live_...`
5. Test with a real card (charge yourself $1 to verify)
6. Refund the test transaction
7. You're live! 🎉

## 📧 Email Receipts

Stripe automatically sends email receipts to customers. You can customize these:

1. Go to Stripe Dashboard > Settings > Emails
2. Customize the receipt email with your branding
3. Add your logo
4. Update email text

## 🆘 Troubleshooting

### "Failed to create checkout session"

- Check that `STRIPE_SECRET_KEY` is set in Netlify environment variables
- Verify the key starts with `sk_test_` or `sk_live_`
- Check Netlify function logs for errors

### Checkout button does nothing

- Open browser console (F12) to see JavaScript errors
- Verify `STRIPE_PUBLISHABLE_KEY` is set correctly in `checkout.js`
- Make sure the key starts with `pk_test_` or `pk_live_`

### "This application is not available in your region"

- Make sure you're using a valid Stripe account
- Stripe is available in 45+ countries - check [stripe.com/global](https://stripe.com/global)

### Orders not showing in Stripe Dashboard

- Make sure you're using the correct mode (test vs live)
- Toggle between "Test mode" and "Live mode" in dashboard

## 📊 Alternative: Use Stripe Payment Links (No Code)

If you prefer not to use serverless functions, you can create Payment Links in Stripe:

1. Go to Stripe Dashboard > Payment Links
2. Create a link for each product
3. Replace checkout flow with direct links to Stripe

This is simpler but less flexible than the current implementation.

## 💡 Next Steps

Once your basic checkout is working, consider:

- Setting up Stripe webhooks for order fulfillment
- Adding subscription products
- Enabling discount codes
- Setting up abandoned cart recovery
- Integrating with shipping providers
- Adding customer accounts with saved payment methods

## 🔗 Helpful Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Test Cards](https://stripe.com/docs/testing)

## 📞 Support

- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)
- **Netlify Support:** [https://answers.netlify.com](https://answers.netlify.com)

---

**Estimated Setup Time:** 30-60 minutes (including account creation)

**Cost to Test:** $0 (use test mode)

**Cost to Go Live:** 2.9% + $0.30 per transaction (no monthly fees)
