import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../product';
import { ProductsService } from '../products.service';
import { CartService } from './../../cart/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [NgFor, MatCardModule, NgIf, MatButtonModule, MatIconModule, AsyncPipe]
})
export class ProductsListComponent {

  private service = inject(ProductsService);
  private cartService = inject(CartService);
  products$: Observable<Product[]>;

  constructor() {
    this.products$ = this.service.load();
  }

  addProductToCart(product: Product): void {
    this.cartService.addProduct(product);
  }
}
