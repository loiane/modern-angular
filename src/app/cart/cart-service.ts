import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  readonly cartItemsCount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const itemExists = items.some((item) => item.product.id === product.id);
      if (itemExists) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  getCartItems() {
    return this.cartItems;
  }
}
