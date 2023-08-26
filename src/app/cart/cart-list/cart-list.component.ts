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
  cartTotal = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.cartItems$ = this.cartService.getCartItems();
  }
}
