import { Component, signal } from '@angular/core';
import { ProductComponent, type Product } from '../product/product';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      category: 'Electronics',
      isOnSale: true
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewCount: 256,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      description: 'Comfortable ergonomic office chair designed for long working hours with lumbar support.',
      price: 349.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewCount: 89,
      category: 'Furniture',
      isOnSale: true
    },
    {
      id: 4,
      name: 'Wireless Keyboard & Mouse Set',
      description: 'Sleek wireless keyboard and mouse combo perfect for productivity and gaming.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
      rating: 4.2,
      reviewCount: 167,
      category: 'Electronics'
    },
    {
      id: 5,
      name: 'Professional Camera Lens',
      description: 'High-quality camera lens for professional photography with exceptional clarity.',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewCount: 45,
      category: 'Photography'
    },
    {
      id: 6,
      name: 'Minimalist Desk Lamp',
      description: 'Modern LED desk lamp with adjustable brightness and sleek minimalist design.',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewCount: 203,
      category: 'Home & Garden',
      isOnSale: true
    }
  ]);

  addToCart(product: Product): void {
    console.log('Added to cart:', product.name);
    // Here you would implement the actual cart functionality
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
    // Here you would implement the actual wishlist functionality
  }
}
