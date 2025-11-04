// Checkout JavaScript for Beas Delicacies - Stripe Checkout Integration

// ==========================================
// STRIPE CONFIGURATION
// ==========================================
// Replace with your actual Stripe publishable key from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';

// Your serverless function endpoint (Netlify/Vercel) or backend API
// After deployment, update this to your actual endpoint
const CREATE_CHECKOUT_SESSION_URL = '/.netlify/functions/create-checkout-session';
// For Vercel, use: '/api/create-checkout-session'
// For custom backend: 'https://your-api.com/create-checkout-session'

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Calculate totals
function calculateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 50;
  const shipping = subtotal >= shippingThreshold ? 0 : 8.99;
  const taxRate = 0.10;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };
}

// Display order summary
function displayOrderSummary() {
  const cart = getCart();
  
  if (cart.length === 0) {
    alert('Your cart is empty!');
    window.location.href = 'shop.html';
    return;
  }
  
  const orderItemsContainer = document.getElementById('order-items');
  
  orderItemsContainer.innerHTML = cart.map(item => `
    <div class="order-summary-item">
      <div class="item-details">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-quantity">Quantity: ${item.quantity}</div>
        </div>
      </div>
      <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  // Display totals
  const totals = calculateTotals();
  document.getElementById('checkout-subtotal').textContent = `$${totals.subtotal}`;
  document.getElementById('checkout-shipping').textContent = totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`;
  document.getElementById('checkout-tax').textContent = `$${totals.tax}`;
  document.getElementById('checkout-total').textContent = `$${totals.total}`;
}

// Update cart count
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('#cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Handle payment method selection
function setupPaymentMethods() {
  const paymentMethods = document.querySelectorAll('.payment-method');
  const cardPayment = document.getElementById('card-payment');
  const paypalPayment = document.getElementById('paypal-payment');
  const applePayment = document.getElementById('apple-payment');
  
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      // Remove active class from all methods
      paymentMethods.forEach(m => m.classList.remove('active'));
      
      // Add active class to clicked method
      method.classList.add('active');
      
      // Get selected payment type
      const selectedPayment = method.querySelector('input[type="radio"]').value;
      
      // Show/hide payment details
      cardPayment.style.display = 'none';
      paypalPayment.style.display = 'none';
      applePayment.style.display = 'none';
      
      if (selectedPayment === 'card') {
        cardPayment.style.display = 'block';
      } else if (selectedPayment === 'paypal') {
        paypalPayment.style.display = 'block';
      } else if (selectedPayment === 'apple') {
        applePayment.style.display = 'block';
      }
    });
  });
}

// Handle form submission
const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Disable submit button to prevent double submission
  const submitButton = checkoutForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Redirecting to Stripe...';

  try {
    await redirectToStripeCheckout();
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to start checkout. Please try again.\n\nError: ' + error.message);
    submitButton.disabled = false;
    submitButton.textContent = 'Place Order';
  }
});

// ==========================================
// STRIPE CHECKOUT REDIRECT
// ==========================================
async function redirectToStripeCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    throw new Error('Your cart is empty');
  }

  // Get customer information from form
  const customerInfo = {
    email: document.getElementById('email').value,
    name: document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value,
    phone: document.getElementById('phone').value,
    address: {
      line1: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      postal_code: document.getElementById('zip').value,
      country: document.getElementById('country').value
    }
  };

  // Prepare line items for Stripe
  const lineItems = cart.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [getFullImageUrl(item.image)]
      },
      unit_amount: Math.round(item.price * 100) // Convert to cents
    },
    quantity: item.quantity
  }));

  // Calculate shipping
  const totals = calculateTotals();
  const shippingAmount = parseFloat(totals.shipping);

  try {
    // Call your serverless function to create checkout session
    const response = await fetch(CREATE_CHECKOUT_SESSION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lineItems,
        customerInfo,
        shippingAmount: Math.round(shippingAmount * 100), // Convert to cents
        successUrl: window.location.origin + '/html/success.html?session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: window.location.origin + '/html/checkout.html'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Helper function to get full image URL
function getFullImageUrl(imagePath) {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Convert relative path to absolute URL
  const baseUrl = window.location.origin;
  const cleanPath = imagePath.replace(/^\.\.\//, '/html/');
  return baseUrl + cleanPath;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayOrderSummary();
  updateCartCount();
  setupPaymentMethods();
});
