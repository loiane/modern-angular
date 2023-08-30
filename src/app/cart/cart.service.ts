import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);
  private cartItems$ = new BehaviorSubject<CartItem[]>(this.cartItems());

  cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));

  cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));

  // calculate tax of 8% on top of the subtotal
  cartTax = computed(() => this.cartSubTotal() * 0.08);

  cartTotal = computed(() => this.cartSubTotal() + this.cartTax());

  addProduct(product: Product): void {
    const itemFound = this.cartItems().find((p) => p.product.id === product.id);
    if (itemFound) {
      itemFound.quantity += 1;
    } else {
      this.cartItems.mutate((items) => items.push({ product, quantity: 1 }));
    }
  }

  updateCartQuantity(cartItem: CartItem): void {
    const itemFound = this.cartItems().find((p) => p.product.id === cartItem.product.id);
    if (itemFound) {
      itemFound.quantity = cartItem.quantity;
    }
  }

  removeProduct(product: Product): void {
    this.cartItems.update((items) => items.filter((p) => p.product.id !== product.id));
  }

}
