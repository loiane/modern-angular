import { Component, Input, inject } from '@angular/core';
import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, CurrencyPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, MatButtonModule, MatIconModule, CurrencyPipe]
})
export class CartItemComponent {

  @Input() cartItem!: CartItem;

  quantityOptions = [1, 2, 3, 4, 5];

  private cartService = inject(CartService);

  onQuantityChange(quantity: number, cartItem: CartItem) {
    cartItem.quantity = quantity;
    this.cartService.updateCartQuantity(cartItem);
  }

  onRemove(): void {
    this.cartService.removeProduct(this.cartItem.product);
  }
}
