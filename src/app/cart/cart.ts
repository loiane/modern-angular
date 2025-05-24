import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CartListComponent } from './cart-list/cart-list';
import { CartTotalSummaryComponent } from './cart-total-summary/cart-total-summary';

@Component({
  selector: 'app-cart',
  imports: [
    MatToolbarModule,
    CartListComponent,
    CartTotalSummaryComponent
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {}
