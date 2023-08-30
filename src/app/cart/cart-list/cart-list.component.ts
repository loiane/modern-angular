import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrls: ['./cart-list.component.scss'],
    standalone: true,
    imports: [MatCardModule, NgFor, CartItemComponent, AsyncPipe]
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
