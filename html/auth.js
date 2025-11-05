// Authentication JavaScript for Bea's Delicacies

// Switch between login and signup tabs
function switchTab(tab) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabs = document.querySelectorAll('.auth-tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabs[0].classList.add('active');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    tabs[1].classList.add('active');
  }
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // In a real application, you would send these credentials to your backend API
  // Example: 
  // fetch('/api/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password })
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     localStorage.setItem('authToken', data.token);
  //     localStorage.setItem('user', JSON.stringify(data.user));
  //     window.location.href = 'index.html';
  //   } else {
  //     alert('Login failed: ' + data.message);
  //   }
  // });

  // For demonstration purposes, we'll simulate a successful login
  const mockUser = {
    name: 'Demo User',
    email: email
  };

  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('isLoggedIn', 'true');

  alert('Login successful! Welcome back!');
  
  // Always redirect to home page after login
  window.location.href = 'index.html';
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  // Validate password match
  if (password !== confirm) {
    alert('Passwords do not match!');
    return;
  }

  // Validate password strength
  if (password.length < 8) {
    alert('Password must be at least 8 characters long!');
    return;
  }

  // In a real application, you would send these details to your backend API
  // Example:
  // fetch('/api/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, password })
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     localStorage.setItem('authToken', data.token);
  //     localStorage.setItem('user', JSON.stringify(data.user));
  //     window.location.href = 'index.html';
  //   } else {
  //     alert('Signup failed: ' + data.message);
  //   }
  // });

  // For demonstration purposes, we'll simulate a successful signup
  const mockUser = {
    name: name,
    email: email
  };

  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('isLoggedIn', 'true');
  
  // Clear pending account email if it exists
  localStorage.removeItem('pendingAccountEmail');

  alert('Account created successfully! Welcome to Bea's Delicacies!');
  
  // Always redirect to home page after signup
  window.location.href = 'index.html';
}

// Check if user is logged in and update UI accordingly
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));

  // Update navigation
  const loginLink = document.querySelector('a[href="login.html"]');
  
  if (isLoggedIn && user && loginLink) {
    const firstName = user.name.split(' ')[0]; // Show first name
    loginLink.textContent = `Hi, ${firstName}!`;
    
    // Change click behavior to show logout option
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm(`Hi ${firstName}! Would you like to log out?`)) {
        logout();
      }
    });
  }
}

// Logout function
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('authToken');
  alert('You have been logged out successfully.');
  window.location.href = 'login.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Update cart count on all pages
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('#cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Initialize cart count
document.addEventListener('DOMContentLoaded', updateCartCount);

// Check if coming from checkout with pending account
document.addEventListener('DOMContentLoaded', () => {
  // Check URL parameters for action
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  
  // If action is signup, switch to signup tab
  if (action === 'signup') {
    switchTab('signup');
  }
  
  // Check for pending account email from guest checkout
  const pendingEmail = localStorage.getItem('pendingAccountEmail');
  if (pendingEmail) {
    // Pre-fill email in signup form
    const signupEmailField = document.getElementById('signup-email');
    if (signupEmailField) {
      signupEmailField.value = pendingEmail;
    }
    // Switch to signup tab
    switchTab('signup');
  }
});
