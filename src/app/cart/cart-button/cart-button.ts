import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-button',
  imports: [MatButtonModule, RouterLink, MatIconModule, MatBadgeModule],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.scss'
})
export class CartButton {
  protected readonly cartService = inject(CartService);

  protected readonly cartAriaLabel = computed(() => {
    const itemCount = this.cartService.totalItems();
    const itemText = itemCount === 1 ? 'item' : 'items';
    return `Cart with ${itemCount} ${itemText}. Open cart`;
  });

  protected readonly screenReaderText = computed(() => {
    const itemCount = this.cartService.totalItems();
    if (itemCount === 0) {
      return 'Cart is empty';
    }
    const itemText = itemCount === 1 ? 'item' : 'items';
    return `${itemCount} ${itemText} in cart`;
  });
}
