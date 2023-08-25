import { CartService } from './../../cart/cart.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {

  products$: Observable<Product[]>;

  constructor(private service: ProductsService, private cartService: CartService) {
    this.products$ = this.service.load();
  }

  addProductToCart(product: Product): void {
    this.cartService.addProduct();
  }
}
