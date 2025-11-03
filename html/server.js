// server.js - Example Backend Server for Beas Delicacies
// This is a Node.js/Express server that handles payment processing and order management

// Install dependencies first:
// npm install express stripe cors dotenv body-parser

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve your HTML/CSS/JS files from current directory

// ============================================
// PAYMENT ENDPOINTS
// ============================================

// Create a payment intent (Stripe)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, cart, shippingInfo } = req.body;

    // Validate amount
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: `ORD-${Date.now()}`,
        customerEmail: shippingInfo.email,
        customerName: shippingInfo.name,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.metadata.orderId,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💰 Payment succeeded:', paymentIntent.id);
      
      // TODO: Update order status in database
      // TODO: Send confirmation email
      // TODO: Update inventory
      
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment failed:', failedPayment.id);
      
      // TODO: Notify customer of failed payment
      
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// Create an order (called after successful payment)
app.post('/api/orders', async (req, res) => {
  try {
    const { orderId, items, totals, shippingInfo, paymentIntentId } = req.body;

    // TODO: Save order to database
    // Example structure:
    const order = {
      orderId,
      date: new Date(),
      items,
      totals,
      shippingInfo,
      paymentIntentId,
      status: 'processing',
    };

    console.log('📦 New order created:', orderId);

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // TODO: Fetch order from database
    // const order = await db.orders.findOne({ orderId });

    // For demo purposes:
    const order = {
      orderId,
      status: 'processing',
      message: 'Order details would be fetched from database',
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// USER AUTHENTICATION ENDPOINTS
// ============================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TODO: Validate input
    // TODO: Check if user already exists
    // TODO: Hash password with bcrypt
    // TODO: Save user to database
    // TODO: Generate JWT token

    // For demo purposes:
    res.json({
      success: true,
      user: {
        id: Date.now(),
        name,
        email,
      },
      token: 'demo_jwt_token',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Find user in database
    // TODO: Verify password with bcrypt
    // TODO: Generate JWT token

    // For demo purposes:
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'Demo User',
        email,
      },
      token: 'demo_jwt_token',
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify token
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    // TODO: Verify JWT token
    // TODO: Fetch user from database

    // For demo purposes:
    res.json({
      valid: true,
      user: {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
      },
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    // TODO: Fetch products from database
    
    // For demo purposes:
    const products = [
      {
        id: 1,
        name: 'Classic Vanilla Cupcakes (Dozen)',
        price: 30.00,
        image: 'https://via.placeholder.com/300x300.png?text=Cupcake',
        description: 'Delicious vanilla cupcakes made with premium ingredients',
        category: 'cupcakes',
        inStock: true,
      },
      {
        id: 2,
        name: 'Decadent Chocolate Cake',
        price: 45.00,
        image: 'https://via.placeholder.com/300x300.png?text=Chocolate+Cake',
        description: 'Rich chocolate cake with creamy frosting',
        category: 'cakes',
        inStock: true,
      },
      // Add more products...
    ];

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Fetch product from database

    res.json({
      id,
      name: 'Product Name',
      price: 30.00,
      // ... other details
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EMAIL NOTIFICATIONS (Example with SendGrid)
// ============================================

// Uncomment and configure if using SendGrid:
/*
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrderConfirmationEmail(order) {
  const msg = {
    to: order.shippingInfo.email,
    from: 'orders@beasdelicacies.com', // Use your verified sender
    subject: `Order Confirmation - ${order.orderId}`,
    text: `Thank you for your order! Your order ID is ${order.orderId}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C9A886;">Thank You for Your Order!</h1>
        <p>Your order has been confirmed.</p>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total:</strong> $${order.totals.total}</p>
        <h3>Items:</h3>
        <ul>
          ${order.items.map(item => `
            <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
          `).join('')}
        </ul>
        <p>Your order will be delivered to:</p>
        <p>
          ${order.shippingInfo.name}<br>
          ${order.shippingInfo.address}<br>
          ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zip}
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('📧 Confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
*/

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💳 Payment processing ready`);
  console.log(`📦 Order management ready`);
  console.log(`\nEndpoints:`);
  console.log(`  POST /api/create-payment-intent`);
  console.log(`  POST /api/webhook`);
  console.log(`  POST /api/orders`);
  console.log(`  GET  /api/orders/:orderId`);
  console.log(`  POST /api/auth/register`);
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/verify`);
  console.log(`  GET  /api/products`);
  console.log(`  GET  /api/products/:id`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
