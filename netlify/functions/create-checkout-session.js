// Netlify Function for creating Stripe Checkout Sessions
// This function runs server-side to securely create Stripe checkout sessions

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { lineItems, customerInfo, shippingAmount, successUrl, cancelUrl } = JSON.parse(event.body);

    // Validate required data
    if (!lineItems || !customerInfo || !successUrl || !cancelUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,

      // Add shipping as a line item if applicable
      ...(shippingAmount > 0 && {
        shipping_options: [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingAmount,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        }],
      }),

      // Customer information
      customer_email: customerInfo.email,

      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['US'],
      },

      // Automatic tax calculation (optional - requires Stripe Tax setup)
      // automatic_tax: { enabled: true },

      // Manual tax rate (10%)
      ...(lineItems.length > 0 && {
        line_items: lineItems.map(item => ({
          ...item,
          tax_rates: [] // You can add tax rate IDs here if needed
        }))
      }),

      // Redirect URLs
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Metadata for tracking
      metadata: {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
      },

      // Billing address
      billing_address_collection: 'auto',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Update this in production to your domain
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ sessionId: session.id })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message
      })
    };
  }
};
