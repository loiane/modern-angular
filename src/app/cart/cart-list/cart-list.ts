import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-list',
  imports: [
    CommonModule,
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
  cartService = inject(CartService);

  updateQuantity(productId: number, quantity: string): void {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty)) {
      this.cartService.updateQuantity(productId, qty);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
