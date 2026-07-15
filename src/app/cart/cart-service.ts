import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  readonly cartProducts = this.cartItems.asReadonly();
  readonly cartItemsCount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  addToCart(product: Product) {
    this.modifyItemQuantity(product, 1);
  }

  removeToCart(product: Product) {
    this.modifyItemQuantity(product, -1);
  }

  private modifyItemQuantity(product: Product, delta: number) {
    this.cartItems.update((items) => {
      const index = items.findIndex((item) => item.product.id === product.id);

      if (index === -1) {
        // item not found: add only if increasing quantity
        if (delta > 0) {
          return [...items, { product, quantity: delta }];
        }
        return items;
      }

      const item = items[index];
      const newQuantity = item.quantity + delta;

      if (newQuantity > 0) {
        return items.map((it) =>
          it.product.id === product.id ? { ...it, quantity: newQuantity } : it,
        );
      }

      // quantity === 1: remove the item from the cart
      return items.filter((it) => it.product.id !== product.id);
    });
  }
}
