import { Component } from '@angular/core';

import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-total-summary',
  templateUrl: './cart-total-summary.component.html',
  styleUrls: ['./cart-total-summary.component.scss']
})
export class CartTotalSummaryComponent {

  total = 10.00;

  constructor(public cartService: CartService) { }
}
