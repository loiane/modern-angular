import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCard],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
})
export class ProductsGrid {

}
