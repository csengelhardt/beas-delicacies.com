// Custom Snipcart Configuration for Bea's Delicacies
// Disable auto-open cart and show toast messages instead

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

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #D4B896 0%, #B89968 100%);
    color: #4A4A4A;
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

// Wait for Snipcart to be ready
document.addEventListener('snipcart.ready', () => {
  // Listen for item added events
  Snipcart.events.on('item.added', (item) => {
    // Show toast notification
    showNotification(getRandomBakingMessage());

    // Prevent cart from opening by closing it immediately
    // This happens so fast the user won't see it open
    setTimeout(() => {
      Snipcart.api.theme.cart.close();
    }, 0);
  });
});
