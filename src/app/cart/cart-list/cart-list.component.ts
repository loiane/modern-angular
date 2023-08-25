import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  cartItems$: Observable<CartItem[]> = of([]);
  cartItems: CartItem[] = [];
  cartTotal = 0;

  constructor(private cartService: CartService) {
    console.log('CartListComponent created');
  }

  ngOnInit() {
    console.log('CartListComponent initialized');
    this.cartItems$ = this.cartService.getCartItems();
    this.cartService.getCartItems().subscribe((cartItems) => {
      console.log(cartItems);
      this.cartItems = cartItems;
      this.cartTotal = cartItems ? cartItems[0].quantity : 0;
    });
  }
}
