import { Component, inject } from '@angular/core';
import { CartService } from '../cart-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../products/product';
import { CartItem } from './cart-item/cart-item';

@Component({
  selector: 'app-cart-page',
  imports: [MatButtonModule, MatIconModule, CartItem],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected readonly cartService = inject(CartService);

  protected onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  protected onRemoveToCart(product: Product) {
    this.cartService.removeToCart(product);
  }
}
