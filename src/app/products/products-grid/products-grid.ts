import { Component } from '@angular/core';
import { ProductList } from '../product-list/product-list';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [ProductList],
  templateUrl: './products-grid.html'
})
export class ProductsGrid {}
