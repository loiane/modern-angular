import { Component } from '@angular/core';

import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent {

  cartItems$ = this.cartService.getCartCount();

  constructor(private cartService: CartService) { }
}
