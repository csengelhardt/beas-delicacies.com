# Bea's Delicacies - E-Commerce Integration Guide

## Overview
This package adds a complete login and payment system to your Bea's Delicacies bakery website while maintaining the beautiful existing theme.

## New Files Created

### HTML Pages
1. **login.html** - User authentication page with login and signup forms
2. **cart.html** - Shopping cart page with item management
3. **checkout.html** - Checkout page with payment processing
4. **shop-updated.html** - Updated shop page with cart functionality (replaces shop.html)

### JavaScript Files
1. **auth.js** - Handles user authentication (login/signup/logout)
2. **cart.js** - Manages shopping cart functionality
3. **checkout.js** - Processes payments and orders

## Features Implemented

### 1. User Authentication
- Login with email/password
- Signup with name, email, password
- Social login buttons (Google, Facebook) - ready for integration
- Password validation
- User session management
- Logout functionality

### 2. Shopping Cart
- Add items to cart from shop page
- Update quantities
- Remove items
- Real-time cart count in navigation
- Automatic subtotal, tax, and shipping calculations
- Free shipping on orders over $50
- Cart persistence using localStorage

### 3. Payment System
- Multiple payment methods:
  - Credit/Debit Cards (Stripe)
  - PayPal
  - Apple Pay
- Secure checkout form
- Order summary
- Shipping information collection
- SSL encryption badge

## Quick Start Guide

### Step 1: Replace Files
Replace your existing `shop.html` with `shop-updated.html` (or manually add the script tags to your existing shop.html):
```html
<script src="cart.js"></script>
<script src="auth.js"></script>
```

### Step 2: Add Navigation Links
Update all your HTML pages to include the new cart and login links in the navigation:
```html
<li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
<li><a href="login.html">Login</a></li>
```

### Step 3: Add JavaScript Files
Add these script tags before closing `</body>` tag on all pages:
```html
<script src="cart.js"></script>
<script src="auth.js"></script>
```

### Step 4: Test Basic Functionality
1. Open shop.html in your browser
2. Click "Add to Cart" on any product
3. View your cart at cart.html
4. Proceed to checkout.html

## Setting Up Real Payment Processing

### Option 1: Stripe (Recommended)

**Why Stripe?**
- Easy to integrate
- Excellent documentation
- Supports many payment methods
- Great for small businesses

**Setup Steps:**

1. **Create a Stripe Account**
   - Go to https://stripe.com
   - Sign up for a free account
   - Complete verification

2. **Get Your API Keys**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your Publishable Key (starts with `pk_test_` or `pk_live_`)

3. **Update checkout.js**
   - Replace line 4 in checkout.js:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');
   ```
   With your actual publishable key:
   ```javascript
   const stripe = Stripe('pk_test_51ABC123...');
   ```

4. **Create a Backend Server**
   - Stripe requires a backend to create payment intents
   - See "Backend Setup" section below

### Option 2: PayPal

**Setup Steps:**

1. **Create PayPal Developer Account**
   - Go to https://developer.paypal.com
   - Sign up and get API credentials

2. **Add PayPal JavaScript SDK**
   - Add to checkout.html `<head>`:
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
   ```

3. **Update checkout.js**
   - Implement PayPal payment flow in `processPayPalPayment()` function

### Option 3: Square

**Setup Steps:**

1. **Create Square Account**
   - Go to https://squareup.com/signup
   - Get your Application ID and Location ID

2. **Add Square SDK**
   ```html
   <script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
   ```

3. **Implement Square payment form**

## Backend Setup (Required for Production)

The current implementation uses localStorage for demo purposes. For production, you need a backend server.

### Recommended Tech Stack:

**Option 1: Node.js + Express**
```javascript
// server.js example
const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');
const app = express();

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
});

app.listen(3000);
```

**Option 2: Python + Flask**
```python
from flask import Flask, request, jsonify
import stripe

app = Flask(__name__)
stripe.api_key = 'sk_test_YOUR_SECRET_KEY'

@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.get_json()
    intent = stripe.PaymentIntent.create(
        amount=data['amount'],
        currency='usd'
    )
    return jsonify({'clientSecret': intent.client_secret})
```

**Option 3: PHP**
```php
<?php
require 'vendor/autoload.php';
\Stripe\Stripe::setApiKey('sk_test_YOUR_SECRET_KEY');

$intent = \Stripe\PaymentIntent::create([
  'amount' => $_POST['amount'],
  'currency' => 'usd',
]);

echo json_encode(['clientSecret' => $intent->client_secret]);
?>
```

## Database Setup

You'll need a database to store:
- User accounts
- Orders
- Product inventory

### Recommended Options:

1. **Firebase** (Easiest for beginners)
   - Free tier available
   - No server management
   - Built-in authentication
   - Real-time database

2. **MongoDB Atlas** (Flexible)
   - Free tier available
   - NoSQL database
   - Good for e-commerce

3. **PostgreSQL** (Traditional)
   - Relational database
   - Good for complex queries
   - Free options: Heroku, Supabase

## Security Considerations

### Must Implement:
1. **HTTPS/SSL Certificate**
   - Required for payment processing
   - Free with Let's Encrypt
   - Many hosts provide free SSL

2. **Environment Variables**
   - Never commit API keys to git
   - Use .env files:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Input Validation**
   - Validate all user inputs on server
   - Sanitize data before database storage

4. **Password Hashing**
   - Use bcrypt or similar
   - Never store plain text passwords

5. **CSRF Protection**
   - Implement CSRF tokens
   - Use same-site cookies

## Deployment Options

### Quick Deploy Options:

1. **Netlify** (Static files + Functions)
   - Free tier
   - Automatic HTTPS
   - Serverless functions for backend
   - Deploy: `netlify deploy`

2. **Vercel** (Static + Serverless)
   - Free tier
   - Great for Next.js
   - Easy API routes
   - Deploy: `vercel deploy`

3. **Heroku** (Full backend)
   - Free tier available
   - Supports Node.js, Python, PHP
   - Easy database add-ons
   - Deploy: `git push heroku main`

4. **AWS** (Scalable)
   - S3 for static files
   - Lambda for serverless functions
   - RDS for database

## Testing

### Test Cards (Stripe):
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires Auth: 4000 0027 6000 3184

Use any future expiry date and any 3-digit CVC.

### Test Mode:
- The current implementation works in "test mode"
- No real charges are made
- Use test API keys (starting with `pk_test_` or `sk_test_`)

## Customization

### Changing Colors:
All theme colors are in `style.css` using CSS variables:
```css
:root {
  --primary-color: #C9A886;
  --secondary-color: #D4B896;
  /* etc. */
}
```

### Adding Products:
Edit shop.html to add more products following this structure:
```html
<div class="product-card">
  <img src="image.jpg" alt="Product">
  <div class="product-card-content">
    <h3>Product Name</h3>
    <p class="product-price">$XX.XX</p>
    <a href="#" class="btn">Add to Cart</a>
  </div>
</div>
```

### Email Notifications:
Use services like:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

## Troubleshooting

### Cart not updating?
- Check browser console for errors
- Ensure cart.js is loaded
- Check localStorage in browser dev tools

### Payment not working?
- Verify Stripe keys are correct
- Check network tab for API errors
- Ensure HTTPS is enabled (required for Stripe)

### Login not persisting?
- Check localStorage
- Ensure auth.js is loaded on all pages
- Clear cache and cookies

## Support & Resources

### Documentation:
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Firebase: https://firebase.google.com/docs

### Tutorials:
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- PayPal Integration: https://developer.paypal.com/docs/checkout/
- User Authentication: https://firebase.google.com/docs/auth

## Next Steps

1. ✅ Test all functionality locally
2. ⬜ Set up Stripe account and get API keys
3. ⬜ Create backend server
4. ⬜ Set up database
5. ⬜ Implement user authentication backend
6. ⬜ Test payment processing
7. ⬜ Add email notifications
8. ⬜ Deploy to production
9. ⬜ Test with real transactions (small amounts)
10. ⬜ Launch!

## License
This code is provided as-is for your bakery website. Feel free to modify and use as needed.

## Questions?
For payment processing questions, consult:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

---

**Important**: Before going live, thoroughly test all payment flows with test cards and small real transactions. Never use production API keys in client-side code.
