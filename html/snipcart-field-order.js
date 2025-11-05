// Snipcart Field Reordering Script
// This script reorders the Snipcart checkout fields to place Country after Postal Code

document.addEventListener('snipcart.ready', () => {
  // Use MutationObserver to detect when Snipcart modal opens and DOM changes
  const observer = new MutationObserver((mutations) => {
    reorderSnipcartFields();
  });

  // Observe the Snipcart container for changes
  const snipcartContainer = document.getElementById('snipcart');
  if (snipcartContainer) {
    observer.observe(snipcartContainer, {
      childList: true,
      subtree: true
    });
  }

  // Also try to reorder immediately when checkout is opened
  Snipcart.events.on('theme.routechanged', (route) => {
    if (route && route.startsWith('/checkout')) {
      setTimeout(reorderSnipcartFields, 100);
      setTimeout(reorderSnipcartFields, 500);
      setTimeout(reorderSnipcartFields, 1000);
    }
  });
});

function reorderSnipcartFields() {
  // Find all address field containers in Snipcart
  const addressSections = document.querySelectorAll('[class*="snipcart-address"], [class*="snipcart-shipping"], [class*="snipcart-billing"]');

  addressSections.forEach(section => {
    // Find country, postal code, and region/state fields
    const countryField = section.querySelector('[class*="country"], [name*="country"], [id*="country"]')?.closest('[class*="field"], [class*="form-group"], .snipcart-form__field');
    const postalField = section.querySelector('[class*="postal"], [name*="postalCode"], [name*="zip"], [id*="postal"], [id*="zip"]')?.closest('[class*="field"], [class*="form-group"], .snipcart-form__field');
    const regionField = section.querySelector('[class*="region"], [name*="region"], [name*="province"], [name*="state"], [id*="region"], [id*="province"], [id*="state"]')?.closest('[class*="field"], [class*="form-group"], .snipcart-form__field');

    // Only reorder if we found all three fields
    if (countryField && postalField && regionField && countryField.parentNode) {
      const parent = countryField.parentNode;

      // Check if country is currently before postal code
      const countryIndex = Array.from(parent.children).indexOf(countryField);
      const postalIndex = Array.from(parent.children).indexOf(postalField);
      const regionIndex = Array.from(parent.children).indexOf(regionField);

      // If country comes before postal code, reorder it
      if (countryIndex < postalIndex) {
        // Remove country field and insert it after postal code
        parent.removeChild(countryField);

        // Insert after postal code
        if (postalField.nextSibling) {
          parent.insertBefore(countryField, postalField.nextSibling);
        } else {
          parent.appendChild(countryField);
        }
      }
    }
  });
}
