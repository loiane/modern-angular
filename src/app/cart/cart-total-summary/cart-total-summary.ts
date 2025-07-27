import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';
import { NotificationService } from '../../shared/services/notification.service';

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
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  // Expose cart service for template
  get cart() {
    return this.cartService;
  }

  proceedToCheckout(): void {
    if (this.cartService.isEmpty()) {
      this.notificationService.showError('Your cart is empty. Add some items before checkout.');
      return;
    }

    // Placeholder for checkout logic
    this.notificationService.showInfo('Checkout functionality will be implemented soon!');
  }

  clearCart(): void {
    if (this.cartService.isEmpty()) {
      this.notificationService.showInfo('Your cart is already empty.');
      return;
    }

    this.cartService.clearCart();
    this.notificationService.showSuccess('Cart cleared successfully!');
  }
}
