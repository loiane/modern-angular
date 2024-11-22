import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../cart.service';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrls: ['./cart-list.component.scss'],
    imports: [MatCardModule, CartItemComponent, AsyncPipe]
})
export class CartListComponent {

  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;

}
