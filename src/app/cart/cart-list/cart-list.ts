import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-cart-list',
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './cart-list.html',
  styleUrl: './cart-list.scss'
})
export class CartListComponent {
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  // Expose cart service for template
  get cart() {
    return this.cartService;
  }

  updateQuantity(productId: number, quantity: string): void {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      this.notificationService.showError('Please enter a valid quantity');
      return;
    }

    const result = this.cartService.updateQuantity(productId, qty);
    if (!result.success) {
      this.notificationService.showError(result.message);
    }
  }

  removeItem(productId: number): void {
    const result = this.cartService.removeFromCart(productId);
    if (result.success) {
      this.notificationService.showSuccess('Item removed from cart');
    } else {
      this.notificationService.showError(result.message);
    }
  }
}
