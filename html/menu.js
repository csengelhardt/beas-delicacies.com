/**
 * Mobile Hamburger Menu System
 * Handles toggle functionality, keyboard navigation, and accessibility
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;
  const navLinks = document.querySelectorAll('.main-nav a');

  // Toggle menu function
  function toggleMenu() {
    const isActive = hamburger.classList.contains('active');

    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    navOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');

    // Update ARIA attributes for accessibility
    hamburger.setAttribute('aria-expanded', !isActive);
    nav.setAttribute('aria-hidden', isActive);
  }

  // Close menu function
  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    navOverlay.classList.remove('active');
    body.classList.remove('menu-open');

    // Update ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  }

  // Hamburger click event
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Overlay click event - close menu when clicking outside
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Keyboard navigation - close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
      hamburger.focus(); // Return focus to hamburger button
    }
  });

  // Handle window resize - close menu if resizing to desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && nav.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });

  // Trap focus within mobile menu when open
  nav.addEventListener('keydown', function(e) {
    if (!nav.classList.contains('active')) return;

    const focusableElements = nav.querySelectorAll('a, button');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Initialize ARIA attributes
  if (hamburger) {
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'main-navigation');
  }

  if (nav) {
    nav.setAttribute('id', 'main-navigation');
    nav.setAttribute('aria-hidden', 'true');
  }
});
