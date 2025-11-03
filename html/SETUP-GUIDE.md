# Beas Delicacies - Complete Setup Guide

## 📋 What You're Building

A fully functional e-commerce bakery website with:
- User authentication (login/signup)
- Shopping cart with real-time updates
- Secure payment processing via Stripe
- Order management system
- Email confirmations
- Responsive design that matches your existing theme

---

## 🚀 Quick Start (15 minutes)

### Step 1: File Setup (5 minutes)

1. **Copy all files** from the outputs folder to your website directory:
   ```
   your-website/
   ├── index.html
   ├── shop-updated.html (rename to shop.html)
   ├── about.html
   ├── contact.html
   ├── login.html         ← NEW
   ├── cart.html          ← NEW
   ├── checkout.html      ← NEW
   ├── style.css
   ├── auth.js            ← NEW
   ├── cart.js            ← NEW
   ├── checkout.js        ← NEW
   ├── server.js          ← NEW (for backend)
   ├── package.json       ← NEW
   ├── .env.example       ← NEW
   └── .gitignore         ← NEW
   ```

2. **Update all your HTML files** to include the new navigation:
   
   Find this line in each HTML file:
   ```html
   <nav class="main-nav">
     <ul>
       <li><a href="index.html">Home</a></li>
       <li><a href="shop.html">Shop</a></li>
       <li><a href="about.html">About</a></li>
       <li><a href="contact.html">Contact</a></li>
   ```
   
   Replace with:
   ```html
   <nav class="main-nav">
     <ul>
       <li><a href="index.html">Home</a></li>
       <li><a href="shop.html">Shop</a></li>
       <li><a href="about.html">About</a></li>
       <li><a href="contact.html">Contact</a></li>
       <li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
       <li><a href="login.html">Login</a></li>
   ```

3. **Add scripts** before `</body>` in these files:
   
   **index.html, about.html, contact.html:**
   ```html
   <script src="cart.js"></script>
   <script src="auth.js"></script>
   </body>
   ```
   
   **shop.html:**
   ```html
   <script src="cart.js"></script>
   <script src="auth.js"></script>
   </body>
   ```

### Step 2: Test Basic Functionality (5 minutes)

1. Open `shop.html` in your browser
2. Click "Add to Cart" on any product
3. Click "Cart" in navigation - you should see your items
4. Try updating quantities
5. Click "Proceed to Checkout"
6. Click "Login" and try creating an account

**At this point, your site works locally with demo data!**

---

## 💳 Adding Real Payment Processing (30 minutes)

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign Up" (it's free!)
3. Complete the registration:
   - Enter business details
   - Verify email
   - Add bank account (for receiving payments)

### Step 2: Get API Keys

1. Log in to Stripe Dashboard: https://dashboard.stripe.com
2. Click "Developers" in left sidebar
3. Click "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) - safe to use in frontend
   - **Secret key** (starts with `sk_test_`) - NEVER expose in frontend

5. Copy both keys somewhere safe

### Step 3: Configure Your Website

1. Open `checkout.js`
2. Find line 4:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');
   ```
3. Replace with your actual publishable key:
   ```javascript
   const stripe = Stripe('pk_test_51ABC123XYZ...');
   ```

### Step 4: Test Payment (it's free!)

1. Open `checkout.html` in your browser
2. Add items to cart and proceed to checkout
3. Use Stripe test card: **4242 4242 4242 4242**
4. Use any future expiry date (e.g., 12/25)
5. Use any 3-digit CVC (e.g., 123)
6. Complete the form and click "Place Order"

**If it works - congratulations! You're processing test payments!**

---

## 🔧 Setting Up the Backend (45 minutes)

Currently, your site works entirely in the browser (frontend only). For production, you need a backend server to:
- Securely process payments
- Store user data
- Manage orders
- Send email confirmations

### Step 1: Install Node.js

1. Download from https://nodejs.org (use LTS version)
2. Install it (accept default options)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Set Up Backend

1. Open terminal/command prompt
2. Navigate to your website folder:
   ```bash
   cd path/to/your-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   This will install all required packages (takes ~2 minutes)

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` file and add your keys:
   ```
   PORT=3000
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

6. Start the server:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   🚀 Server running on port 3000
   💳 Payment processing ready
   ```

### Step 3: Update Frontend to Use Backend

1. Open `checkout.js`

2. Find the `processCardPayment()` function

3. Uncomment the real implementation (it's around line 100)

4. The frontend will now communicate with your backend!

---

## 📧 Adding Email Notifications (20 minutes)

### Option 1: SendGrid (Recommended)

1. **Sign up:**
   - Go to https://sendgrid.com
   - Create free account (100 emails/day free)

2. **Get API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Give it "Mail Send" permissions
   - Copy the key

3. **Add to .env:**
   ```
   SENDGRID_API_KEY=SG.your_key_here
   FROM_EMAIL=orders@yourdomain.com
   ```

4. **Install SendGrid:**
   ```bash
   npm install @sendgrid/mail
   ```

5. **Uncomment email code** in `server.js` (search for "SendGrid")

### Option 2: Mailgun

1. Sign up at https://mailgun.com (free tier available)
2. Get API key from dashboard
3. Install: `npm install mailgun-js`
4. Configure similar to SendGrid

---

## 🗄️ Adding a Database (30 minutes)

Currently, orders are only saved in the browser. For production, use a database.

### Option 1: MongoDB Atlas (Easiest)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster:**
   - Click "Build a Cluster"
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create Cluster" (takes ~5 minutes)

3. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

4. **Add to .env:**
   ```
   DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/bakery
   ```

5. **Install Mongoose:**
   ```bash
   npm install mongoose
   ```

6. **Create models** (example in server.js comments)

### Option 2: PostgreSQL

1. Sign up for free tier at https://www.elephantsql.com
2. Create instance
3. Get connection URL
4. Install: `npm install pg`
5. Configure in server.js

---

## 🚢 Deploying to Production (60 minutes)

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI:**
   - Download from https://devcenter.heroku.com/articles/heroku-cli

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create beas-delicacies
   ```

4. **Add environment variables:**
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

5. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Open your app:**
   ```bash
   heroku open
   ```

### Option 2: Netlify (Static) + Netlify Functions (Backend)

1. Sign up at https://netlify.com
2. Connect your Git repository
3. Configure build settings
4. Add environment variables in Netlify dashboard
5. Deploy!

### Option 3: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Done!

---

## 🔒 Security Checklist

Before going live, ensure:

- [ ] Using HTTPS (SSL certificate)
- [ ] Changed all test API keys to live keys
- [ ] Added all secret keys to `.env` (not hardcoded)
- [ ] `.env` is in `.gitignore`
- [ ] Using environment variables on hosting platform
- [ ] Implementing rate limiting
- [ ] Validating all user inputs
- [ ] Using CORS properly
- [ ] Hashing passwords with bcrypt
- [ ] Implementing CSRF protection
- [ ] Regular security updates

---

## 🧪 Testing Checklist

Test these scenarios before launch:

### Shopping Cart
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persists on page reload
- [ ] Cart count updates in navigation

### Authentication
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Logout functionality
- [ ] Password validation
- [ ] Error messages display correctly

### Checkout
- [ ] All form fields validate correctly
- [ ] Shipping calculated correctly
- [ ] Tax calculated correctly
- [ ] Test successful payment (use test cards)
- [ ] Test failed payment (use test cards)
- [ ] Order confirmation displays

### Email
- [ ] Order confirmation email sends
- [ ] Email formatting looks good
- [ ] All order details included

---

## 📱 Mobile Testing

Test on these devices/screen sizes:
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)

---

## 🆘 Troubleshooting

### "Cart not updating"
**Solution:**
- Check browser console for errors
- Ensure `cart.js` is loaded
- Clear browser cache
- Check localStorage in DevTools

### "Payment not processing"
**Solution:**
- Verify Stripe keys are correct
- Check Network tab for API errors
- Ensure using HTTPS in production
- Check Stripe dashboard logs

### "Backend not responding"
**Solution:**
- Verify server is running (`npm start`)
- Check port is not in use
- Check `.env` file exists
- Look at server console for errors

### "Email not sending"
**Solution:**
- Verify SendGrid API key
- Check email address is verified
- Look at SendGrid dashboard logs
- Check spam folder

---

## 💰 Costs

### Development (FREE)
- Stripe: Free test mode
- MongoDB Atlas: Free M0 tier
- SendGrid: 100 emails/day free
- Heroku: Free tier available

### Production (Monthly)
- Domain: $10-15/year (~$1/month)
- Hosting: $0-25/month (free tiers available)
- Email: $0-15/month (100-40k emails)
- Payment processing: 2.9% + $0.30 per transaction

**Example:** 100 orders/month at $40 average = $146 in fees
(You'd make $3,854 in revenue)

---

## 📚 Additional Resources

### Documentation
- [Stripe Docs](https://stripe.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://www.mongodb.com/docs/manual/tutorial/)
- [SendGrid Docs](https://docs.sendgrid.com/)

### Video Tutorials
- "Building an E-Commerce Site" - YouTube
- "Stripe Payment Integration" - YouTube
- "Node.js Crash Course" - YouTube

### Community Support
- Stack Overflow
- Reddit: r/webdev
- Discord: Web Dev Community

---

## ✅ Launch Checklist

When you're ready to go live:

1. Testing
   - [ ] All features tested
   - [ ] Mobile responsive
   - [ ] Cross-browser tested

2. Security
   - [ ] HTTPS enabled
   - [ ] Using live API keys
   - [ ] Environment variables set
   - [ ] Security headers configured

3. Content
   - [ ] Replace Lorem Ipsum text
   - [ ] Add real product images
   - [ ] Update product prices
   - [ ] Add terms & conditions
   - [ ] Add privacy policy

4. Business
   - [ ] Bank account connected to Stripe
   - [ ] Business email set up
   - [ ] Customer support ready
   - [ ] Shipping rates finalized

5. Marketing
   - [ ] Domain connected
   - [ ] Google Analytics installed
   - [ ] Social media links added
   - [ ] SEO optimized

---

## 🎉 You Did It!

Your bakery is now online and ready to accept orders!

**Next steps:**
1. Share your website with friends and family
2. Announce on social media
3. Consider paid advertising
4. Monitor your first sales!

**Questions?** 
- Check the main README.md
- Consult the documentation links above
- Search Stack Overflow

**Good luck with your bakery! 🧁**
