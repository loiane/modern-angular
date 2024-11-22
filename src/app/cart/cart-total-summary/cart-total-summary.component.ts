import { Component, inject } from '@angular/core';

import { CartService } from '../cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-cart-total-summary',
    templateUrl: './cart-total-summary.component.html',
    styleUrls: ['./cart-total-summary.component.scss'],
    imports: [MatCardModule, MatButtonModule, AsyncPipe, CurrencyPipe]
})
export class CartTotalSummaryComponent {

  cartService = inject(CartService);
}
