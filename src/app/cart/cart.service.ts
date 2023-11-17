import { computed, effect, Injectable, signal } from '@angular/core';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));

  cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));

  // calculate tax of 8% on top of the subtotal
  cartTax = computed(() => this.cartSubTotal() * 0.08);

  cartTotal = computed(() => this.cartSubTotal() + this.cartTax());

  e = effect(() => console.log('cartCount updated', this.cartCount()));
  i = effect(() => console.log('cartItems updated', this.cartItems()));


  addProduct(product: Product): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === product.id);
    if (indexFound >= 0) {
      const cartItem = this.cartItems()[indexFound];
      cartItem.quantity += 1;
      this.updateCartQuantity(cartItem);
      //this.cartItems.mutate((items) => items[indexFound].quantity += 1);
    } else {
      //this.cartItems.mutate((items) => items.push({ product, quantity: 1 }));
      this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
    }
  }

  updateCartQuantity(cartItem: CartItem): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === cartItem.product.id);
    if (indexFound >= 0) {
      this.cartItems.update((items) => items.map((p) => p.product.id === cartItem.product.id ? cartItem : p));
    }
  }

  removeProduct(product: Product): void {
    this.cartItems.update((items) => items.filter((p) => p.product.id !== product.id));
  }

}
