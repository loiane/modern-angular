import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCount$ = new Subject<number>();
  private total = 0;

  constructor() {
    this.updateCartCount();
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  addProduct(): void {
    this.total++;
    this.updateCartCount();
  }

  private updateCartCount(): void {
    this.cartCount$.next(this.total);
  }
}
