import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Product } from '../product';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    NgOptimizedImage
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();

  addToCart = output<Product>();
  addToWishlist = output<Product>();

  protected getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    while (stars.length < 5) {
      stars.push('star_border');
    }

    return stars;
  }

  protected onAddToCart(): void {
    this.addToCart.emit(this.product());
  }

  protected onAddToWishlist(): void {
    this.addToWishlist.emit(this.product());
  }
}
