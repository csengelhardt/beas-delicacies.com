# Shopping Cart State Persistence Investigation

## Issue
The shopping cart maintains state only on shop.html, but empties when navigating to other pages (index.html, about.html, contact.html).

## Root Cause
**The website is using TWO DIFFERENT shopping cart systems that do not share data:**

### 1. Custom Cart System (localStorage-based)
- **Implementation**: html/cart.js
- **Storage**: Browser localStorage (key: 'cart')
- **Pages using this system**:
  - shop.html
  - cart.html
  - checkout.html
  - login.html

**Cart display element**: `<span id="cart-count">`

### 2. Snipcart (Third-party hosted service)
- **Implementation**: External service from cdn.snipcart.com
- **Storage**: Snipcart's cloud service
- **Pages using this system**:
  - index.html
  - about.html
  - contact.html
  - shop-updated.html

**Cart display element**: `<span class="snipcart-items-count">`

## Technical Details

### shop.html (lines 176-178)
```html
<script src="menu.js"></script>
<script src="cart.js"></script>
<script src="auth.js"></script>
```

Cart link (line 29):
```html
<li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
```

### index.html, about.html, contact.html
```html
<!-- Snipcart Integration -->
<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css" />
...
<script src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"></script>
<script src="menu.js"></script>
```

Cart link (line 81):
```html
<li><a href="#" class="snipcart-checkout">Cart (<span class="snipcart-items-count">0</span>)</a></li>
```

## Why This Happens

1. User adds items to cart on **shop.html** → Items stored in **localStorage** via custom cart.js
2. User navigates to **index.html** → Page loads **Snipcart** system
3. Snipcart looks at its own cloud storage, which is empty
4. Cart appears empty to the user

## Previous Fix Attempt

Commit 27ba416 ("Fix cart consistency issue by including cart.js on all pages") only addressed checkout.html and login.html, but did not resolve the fundamental issue of having two separate cart systems.

## Recommended Solutions

### Option 1: Use Custom Cart System Everywhere (Recommended)
- Remove Snipcart from index.html, about.html, contact.html
- Add cart.js to these pages
- Update cart links to use `<span id="cart-count">` instead of `<span class="snipcart-items-count">`
- Ensures all pages share the same localStorage-based cart
- **Pros**: Free, already implemented, consistent
- **Cons**: Need to implement payment processing separately

### Option 2: Use Snipcart Everywhere
- Remove cart.js from shop.html
- Add Snipcart integration to shop.html
- Update all product "Add to Cart" buttons to use Snipcart's data attributes
- **Pros**: Hosted solution, built-in payment processing
- **Cons**: Costs money, requires migration of shop.html

### Option 3: Synchronize Both Systems (Not Recommended)
- Create a bridge script to sync localStorage cart with Snipcart
- **Cons**: Complex, error-prone, unnecessary overhead

## Files Affected

**Custom cart system pages**:
- html/shop.html
- html/cart.html
- html/checkout.html
- html/login.html
- html/cart.js

**Snipcart pages**:
- html/index.html
- html/about.html
- html/contact.html
- html/shop-updated.html

## Next Steps

1. Decide which cart system to use site-wide
2. Update all pages to use the chosen system consistently
3. Test cart persistence across all page navigations
4. Verify cart count updates correctly on all pages
