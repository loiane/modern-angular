import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../products/product';
import { CartItem as CartItemProp } from '../../cart-item';
@Component({
  selector: 'app-cart-item',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
})
export class CartItem {
  readonly product = input.required<CartItemProp>();
  readonly addToCart = output<Product>();
  readonly removeToCart = output<Product>();

  protected onAddToCart() {
    this.addToCart.emit(this.product().product);
  }

  protected onRemoveToCart() {
    this.removeToCart.emit(this.product().product);
  }
}
