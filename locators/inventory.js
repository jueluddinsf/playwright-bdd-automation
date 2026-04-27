/**
 * locators/inventory.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Selectors for the Inventory / Products page.
 * Usage in feature files:  "inventory.title", "inventory.items"
 *
 * VALUES can be:
 *   - A CSS selector string:      '.title'
 *   - An XPath string:            '//h1[@class="title"]'
 *   - A parameterized function:   (name) => `.item:has-text("${name}")`
 * ─────────────────────────────────────────────────────────────────────────────
 */
module.exports = {
    // Outer container wrapping all inventory items
    container: '#inventory_container',

    // The page heading / title element
    title: '.title',

    // All product cards on the page (collection)
    items: '.inventory_item',

    // The name label inside each product card
    itemName: '.inventory_item_name',

    // The very first product name on the listing page
    firstItemName: '.inventory_item_name >> nth=0',

    // The "Back to products" navigation button on a product detail page
    backButton: '#back-to-products',

    // ── Dynamic / Parameterized Selectors ─────────────────────────────────────
    // Usage: LocatorManager.getSelector('inventory.itemByName')('Sauce Labs Backpack')

    // Find a product card that contains a specific product name
    itemByName: (name) => `.inventory_item:has-text("${name}")`,

    // Find the "Add to cart" button for a specific product name
    addToCartFor: (productName) => `[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`,
};
