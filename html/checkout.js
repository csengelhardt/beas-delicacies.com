// Checkout JavaScript for Bea's Delicacies

// Initialize Stripe (you'll need to replace with your actual publishable key)
// Get your key from: https://dashboard.stripe.com/apikeys
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE'); // Replace with your actual key
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#4A4A4A',
      fontFamily: '"Montserrat", sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#d9534f',
    },
  },
});

// Mount card element
cardElement.mount('#card-element');

// Handle card errors
cardElement.on('change', (event) => {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

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
  
  // Login is now optional - users can checkout as guests
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Get selected payment method
  const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
  
  // Disable submit button to prevent double submission
  const submitButton = checkoutForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  
  try {
    if (selectedPayment === 'card') {
      await processCardPayment();
    } else if (selectedPayment === 'paypal') {
      await processPayPalPayment();
    } else if (selectedPayment === 'apple') {
      await processApplePayPayment();
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Place Order';
  }
});

// Process card payment with Stripe
async function processCardPayment() {
  // In a real application, you would:
  // 1. Create a payment intent on your server
  // 2. Confirm the payment with Stripe
  // 3. Handle the response
  
  // Example implementation:
  /*
  // Get billing details
  const billingDetails = {
    name: document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: {
      line1: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      postal_code: document.getElementById('zip').value,
      country: 'US'
    }
  };
  
  // Create payment method
  const {error, paymentMethod} = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails
  });
  
  if (error) {
    throw error;
  }
  
  // Send payment method to your server
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      paymentMethodId: paymentMethod.id,
      amount: Math.round(parseFloat(calculateTotals().total) * 100), // Amount in cents
      cart: getCart()
    })
  });
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  // Confirm payment
  const {error: confirmError} = await stripe.confirmCardPayment(data.clientSecret);
  
  if (confirmError) {
    throw confirmError;
  }
  */
  
  // For demonstration purposes, simulate a successful payment
  await simulatePayment();
  completeOrder();
}

// Process PayPal payment
async function processPayPalPayment() {
  // In a real application, you would integrate PayPal SDK
  // https://developer.paypal.com/docs/checkout/
  
  await simulatePayment();
  completeOrder();
}

// Process Apple Pay payment
async function processApplePayPayment() {
  // In a real application, you would integrate Apple Pay
  // https://developer.apple.com/apple-pay/
  
  await simulatePayment();
  completeOrder();
}

// Simulate payment processing
function simulatePayment() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simulate 2 second processing time
  });
}

// Complete order
function completeOrder() {
  // Get order details
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));
  
  const orderDetails = {
    orderId: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: getCart(),
    totals: calculateTotals(),
    shippingInfo: {
      name: document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    },
    customerType: isLoggedIn ? 'registered' : 'guest',
    userId: user ? user.id : null
  };
  
  // In a real application, you would send this to your server
  // fetch('/api/orders', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify(orderDetails)
  // });
  
  // Save order to localStorage (for demonstration)
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(orderDetails);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.removeItem('cart');
  
  // Show success message
  let successMessage = `Thank you for your order!\n\nOrder ID: ${orderDetails.orderId}\n\nYou will receive a confirmation email at ${orderDetails.shippingInfo.email}`;
  
  // If guest checkout, offer to create account
  if (!isLoggedIn) {
    successMessage += '\n\nWould you like to create an account to track your orders?';
    if (confirm(successMessage)) {
      // Save order email for account creation
      localStorage.setItem('pendingAccountEmail', orderDetails.shippingInfo.email);
      window.location.href = 'login.html?action=signup';
      return;
    }
  } else {
    alert(successMessage);
  }
  
  // Redirect to home page
  window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayOrderSummary();
  updateCartCount();
  setupPaymentMethods();
});
