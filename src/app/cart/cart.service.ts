import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];
  private cartItems$ = new BehaviorSubject<CartItem[]>(this.cartItems);

  cartCount$ = this.cartItems$.pipe(
    // calculate total quantity
    map((items: CartItem[]) => {
      return items.reduce((acc, curr) => acc + curr.quantity, 0);
    })
  );

  cartSubTotal$ = this.cartItems$.pipe(
    map((items: CartItem[]) =>
      items.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0))
  );

  cartTax$ = this.cartSubTotal$.pipe(
    // calculate tax of 8% on top of the subtotal
    map((subTotal) => subTotal * 0.08)
  );

  cartTotal$ = combineLatest([
    this.cartSubTotal$,
    this.cartTax$
  ]).pipe(map(([subTotal, tax]) => subTotal + tax));


  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  addProduct(product: Product): void {
    const itemFound = this.cartItems.find((p) => p.product.id === product.id);
    if (itemFound) {
      itemFound.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.updateCartItems();
  }


  private updateCartItems(): void {
    this.cartItems$.next(this.cartItems);
  }

  updateCartQuantity(cartItem: CartItem): void {
    const itemFound = this.cartItems.find((p) => p.product.id === cartItem.product.id);
    if (itemFound) {
      itemFound.quantity = cartItem.quantity;
    }
    this.updateCartItems();
  }

  removeProduct(product: Product): void {
    this.cartItems = this.cartItems.filter((p) => p.product.id !== product.id);
    this.updateCartItems();
  }

}
