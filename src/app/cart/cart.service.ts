import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

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

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      this.cartItems.set([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity
      };
      this.cartItems.set(updatedItems);
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
