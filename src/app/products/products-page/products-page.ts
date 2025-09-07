import { Component } from '@angular/core';
import { ProductsGrid } from '../products-grid/products-grid';
import { ProductsSkeleton } from '../products-skeleton/products-skeleton';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsGrid, ProductsSkeleton],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage {}
