import { Component, computed, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../cart/cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Product } from '../product';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly productsResource = this.productService.getProducts();

  // Create computed signals for easier template access
  products = computed(() => this.productsResource.value() ?? []);
  isLoading = computed(() => this.productsResource.isLoading());
  hasError = computed(() => this.productsResource.error() !== undefined);
  errorMessage = computed(() => {
    const error = this.productsResource.error();
    return error ? `Failed to load products: ${error.message}` : '';
  });

  addToCart(product: Product): void {
    const result = this.cartService.addToCart(product, 1);

    if (result.success) {
      this.notificationService.showSuccess(`${product.name} added to cart!`);
    } else {
      this.notificationService.showError(result.message);
    }
  }

  addToWishlist(product: Product): void {
    // Placeholder for wishlist functionality
    this.notificationService.showInfo(`${product.name} will be added to wishlist when feature is implemented.`);
  }

  retryLoading(): void {
    this.productsResource.reload();
  }
}
