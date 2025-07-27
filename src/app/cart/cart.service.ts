import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  private readonly MAX_QUANTITY = 99;
  private readonly MAX_CART_ITEMS = 50;

  // Computed signals for derived state
  items = this.cartItems.asReadonly();

  totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  tax = computed(() => this.subtotal() * 0.1); // 10% tax

  total = computed(() => this.subtotal() + this.tax());

  isEmpty = computed(() => this.cartItems().length === 0);

  addToCart(product: Product, quantity: number = 1): { success: boolean; message: string } {
    // Validation checks
    if (!product?.id) {
      return { success: false, message: 'Invalid product' };
    }

    if (quantity <= 0) {
      return { success: false, message: 'Quantity must be greater than 0' };
    }

    if (this.cartItems().length >= this.MAX_CART_ITEMS) {
      return { success: false, message: 'Cart is full. Remove items to add new ones.' };
    }

    try {
      const currentItems = this.cartItems();
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

      if (existingItemIndex > -1) {
        // Update existing item
        const currentQuantity = currentItems[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > this.MAX_QUANTITY) {
          return {
            success: false,
            message: `Cannot add more than ${this.MAX_QUANTITY} items of the same product`
          };
        }

        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        this.cartItems.set(updatedItems);
      } else {
        // Add new item
        if (quantity > this.MAX_QUANTITY) {
          return {
            success: false,
            message: `Cannot add more than ${this.MAX_QUANTITY} items`
          };
        }

        this.cartItems.set([...currentItems, { product, quantity }]);
      }

      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }

  removeFromCart(productId: number): { success: boolean; message: string } {
    if (!productId) {
      return { success: false, message: 'Invalid product ID' };
    }

    try {
      const currentItems = this.cartItems();
      const newItems = currentItems.filter(item => item.product.id !== productId);

      if (newItems.length === currentItems.length) {
        return { success: false, message: 'Item not found in cart' };
      }

      this.cartItems.set(newItems);
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  }

  updateQuantity(productId: number, quantity: number): { success: boolean; message: string } {
    if (!productId) {
      return { success: false, message: 'Invalid product ID' };
    }

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    if (quantity > this.MAX_QUANTITY) {
      return {
        success: false,
        message: `Quantity cannot exceed ${this.MAX_QUANTITY}`
      };
    }

    try {
      const currentItems = this.cartItems();
      const itemIndex = currentItems.findIndex(item => item.product.id === productId);

      if (itemIndex === -1) {
        return { success: false, message: 'Item not found in cart' };
      }

      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity
      };
      this.cartItems.set(updatedItems);

      return { success: true, message: 'Quantity updated successfully' };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return { success: false, message: 'Failed to update quantity' };
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getItemQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item?.quantity ?? 0;
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }
}
