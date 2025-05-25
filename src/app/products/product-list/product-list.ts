import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { Product } from '../product';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private productsResource = this.productService.getProducts();

  // Create computed signals for easier template access
  products = computed(() => this.productsResource.value() ?? []);
  isLoading = computed(() => this.productsResource.isLoading());
  hasError = computed(() => this.productsResource.error() !== undefined);

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    console.log('Added to cart:', product.name);
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
    // Here you would implement the actual wishlist functionality
  }
}
