import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-total-summary',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CurrencyPipe
  ],
  templateUrl: './cart-total-summary.html',
  styleUrl: './cart-total-summary.scss'
})
export class CartTotalSummaryComponent {
  cartService = inject(CartService);

  proceedToCheckout(): void {
    // Implement checkout logic here
    console.log('Proceeding to checkout...');
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
