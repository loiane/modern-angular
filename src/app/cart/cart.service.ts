import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private total = 0;
  private cartCount$ = new Subject<number>();

  private cartItems: CartItem[] = [];
  private cartItems$ = new Subject<CartItem[]>();

  constructor() {
    this.updateCartCount();
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  addProduct(product: Product): void {

    // Check if product is already in cart
    const itemFound = this.cartItems.find((p) => p.product.id === product.id);
    console.log(itemFound);
    if (itemFound) {
      itemFound.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.total++;
    this.updateCartCount();
    this.updateCartItems();
  }

  private updateCartCount(): void {
    this.cartCount$.next(this.total);
  }

  private updateCartItems(): void {
    this.cartItems$.next(this.cartItems);
  }



}
