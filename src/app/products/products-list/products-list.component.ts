import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../product';
import { ProductsService } from '../products.service';
import { CartService } from './../../cart/cart.service';

@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
    imports: [MatCardModule, MatButtonModule, MatIconModule, AsyncPipe]
})
export class ProductsListComponent {

  private service = inject(ProductsService);
  private cartService = inject(CartService);
  products$ = this.service.load();

  addProductToCart(product: Product): void {
    this.cartService.addProduct(product);
  }
}
