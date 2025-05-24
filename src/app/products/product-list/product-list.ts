import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card';
import { Product } from '../product';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private productService = inject(ProductService);
  products = this.productService.getProducts();

  addToCart(product: Product): void {
    console.log('Added to cart:', product.name);
    // Here you would implement the actual cart functionality
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
    // Here you would implement the actual wishlist functionality
  }
}
