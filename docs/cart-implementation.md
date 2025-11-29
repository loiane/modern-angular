# Shopping Cart Component

This document provides an overview of the shopping cart feature that has been implemented in the Angular application.

## Structure

The cart functionality is organized under the `src/app/cart/` folder with the following structure:

```
cart/
├── cart.ts                    # Main cart component
├── cart.html                  # Cart template
├── cart.scss                  # Cart styles
├── cart.spec.ts              # Cart component tests
├── cart-item.ts              # Cart item interface
├── cart.service.ts           # Cart service with signals
├── cart.service.spec.ts      # Cart service tests
├── cart-list/
│   ├── cart-list.ts          # Cart items list component
│   ├── cart-list.html        # Cart list template
│   ├── cart-list.scss        # Cart list styles
│   └── cart-list.spec.ts     # Cart list tests
└── cart-total-summary/
    ├── cart-total-summary.ts      # Cart total summary component
    ├── cart-total-summary.html    # Cart total template
    ├── cart-total-summary.scss    # Cart total styles
    └── cart-total-summary.spec.ts # Cart total tests
```

## Features

### 1. Cart Service (`cart.service.ts`)
- **Signal-based state management** using Angular's new signals API
- **Reactive computed properties** for totals, tax calculation, and item counts
- **CRUD operations** for cart items (add, remove, update quantity, clear)
- **Automatic calculations** for subtotal, tax (10%), and total
- **Type-safe** with proper TypeScript interfaces

### 2. Main Cart Component (`cart/cart`)
- **Clean layout** with toolbar header
- **Two-column layout** for cart items and summary
- **Responsive design** that stacks on mobile devices
- **Material Design** using Angular Material components

### 3. Cart List Component (`cart-list/cart-list`)
- **Dynamic item display** showing product details
- **Quantity controls** with number input
- **Remove item functionality** with delete button
- **Empty state** with friendly message and icon
- **Responsive item cards** with product images
- **Real-time total calculation** per item

### 4. Cart Total Summary Component (`cart-total-summary/cart-total-summary`)
- **Order summary** with itemized breakdown
- **Tax calculation** display
- **Total amount** prominently displayed
- **Checkout button** (ready for future implementation)
- **Clear cart functionality**
- **Sticky positioning** for better UX

## Integration

### Navigation
- **Header badge** showing cart item count
- **Cart route** accessible at `/cart`
- **Product integration** - "Add to Cart" buttons work with the cart service

### Product Integration
- **ProductList component** updated to use cart service
- **Real-time updates** when items are added to cart
- **Badge updates** in header when cart changes

## Testing

All components include comprehensive unit tests:
- **Cart Service**: Tests for all CRUD operations and calculations
- **Cart Component**: Tests for rendering and structure
- **Cart List**: Tests for item display and user interactions
- **Cart Total Summary**: Tests for calculations and actions

## Technologies Used

- **Angular 20** with modern features
- **Angular Material** for UI components
- **Angular Signals** for reactive state management
- **TypeScript** for type safety
- **Vitest** for unit testing
- **SCSS** for styling

## Key Benefits

1. **Modern Angular**: Uses the latest Angular signals for efficient reactivity
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Responsive**: Works well on desktop and mobile devices
4. **Testable**: Comprehensive test coverage for all functionality
5. **Maintainable**: Clean separation of concerns and modular structure
6. **Accessible**: Proper ARIA labels and semantic HTML
7. **Performance**: Lazy loading of cart component

## Future Enhancements

The cart system is designed to be easily extensible for:
- Persistent storage (localStorage, server)
- User authentication integration
- Discount codes and promotions
- Multiple payment methods
- Order history
- Wishlist integration
