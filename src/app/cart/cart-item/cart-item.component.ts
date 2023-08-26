import { Component, Input } from '@angular/core';
import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {

  @Input() cartItem!: CartItem;

  quantityOptions = [1, 2, 3, 4, 5];

  constructor(private cartService: CartService) { }

  onQuantityChange(quantity: number, cartItem: CartItem) {
    cartItem.quantity = quantity;
    this.cartService.updateCartQuantity(cartItem);
  }

  onRemove(): void {
    this.cartService.removeProduct(this.cartItem.product);
  }
}
