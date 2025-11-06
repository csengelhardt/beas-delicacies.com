// Shopping Cart JavaScript for Bea's Delicacies

// Baking-related toast messages
const bakingMessages = [
  "Goodie added!",
  "Baked fresh!",
  "Rising nicely!",
  "Perfectly proofed!",
  "Golden brown!",
  "Just glazed!",
  "Fresh batch!",
  "Oven ready!",
  "Dough doubled!",
  "Kneaded that!",
  "Sweet success!",
  "Whisked away!"
];

// Get a random baking message
function getRandomBakingMessage() {
  return bakingMessages[Math.floor(Math.random() * bakingMessages.length)];
}

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('#cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Add item to cart
function addToCart(product) {
  let cart = getCart();
  
  // Check if product already exists in cart
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart(cart);
  showNotification(getRandomBakingMessage());
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  displayCart();
}

// Update item quantity
function updateQuantity(productId, change) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity += change;
    
    // Remove item if quantity reaches 0
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    saveCart(cart);
    displayCart();
  }
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

// Display cart items and totals
function displayCart() {
  const cart = getCart();
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const cartItemsList = document.getElementById('cart-items-list');
  
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartContent.style.display = 'block';
  
  // Display cart items
  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');
  
  // Display totals
  const totals = calculateTotals();
  document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
  document.getElementById('shipping').textContent = totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`;
  document.getElementById('tax').textContent = `$${totals.tax}`;
  document.getElementById('total').textContent = `$${totals.total}`;
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #EDEDFF 0%, #CCCCFF 100%);
    color: #3A3A5A;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize cart page
if (window.location.pathname.includes('cart.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
  });
}

// Initialize shop page - add event listeners to "Add to Cart" buttons
if (window.location.pathname.includes('shop.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Add click handlers to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    addToCartButtons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get product information from the product card
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPriceText = productCard.querySelector('.product-price').textContent;
        const productPrice = parseFloat(productPriceText.replace('$', ''));
        const productImage = productCard.querySelector('img').src;
        
        const product = {
          id: index + 1,
          name: productName,
          price: productPrice,
          image: productImage
        };
        
        addToCart(product);
      });
    });
  });
}

// Initialize on all pages
document.addEventListener('DOMContentLoaded', updateCartCount);
