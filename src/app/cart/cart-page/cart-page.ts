import { Component, inject } from '@angular/core';
import { CartService } from '../cart-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../products/product';
import { CartItem } from './cart-item/cart-item';
import { DialogComponent } from './dialog-component/dialog-component';

@Component({
  selector: 'app-cart-page',
  imports: [MatButtonModule, MatIconModule, CartItem],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected readonly cartService = inject(CartService);
  readonly dialog = inject(MatDialog);

  protected onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  protected onDecreaseToCart(product: Product) {
    this.cartService.decreaseToCart(product);
  }

  protected onRemoveToCart(product: Product) {
    this.openDialog(product, '50ms', '50ms');
  }

  protected openDialog(
    product: Product,
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    this.dialog.open(DialogComponent, {
      data: {
        product,
      },
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
