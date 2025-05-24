import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../products/product';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 50.00,
    image: 'test-image.jpg',
    rating: 4.5,
    reviewCount: 10,
    category: 'test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('should add product to cart', () => {
    service.addToCart(mockProduct, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalItems()).toBe(2);
  });

  it('should update quantity of existing product', () => {
    service.addToCart(mockProduct, 1);
    service.addToCart(mockProduct, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalItems()).toBe(3);
  });

  it('should calculate correct subtotal', () => {
    service.addToCart(mockProduct, 2);

    expect(service.subtotal()).toBe(100.00);
  });

  it('should calculate correct tax (10%)', () => {
    service.addToCart(mockProduct, 2);

    expect(service.tax()).toBe(10.00);
  });

  it('should calculate correct total', () => {
    service.addToCart(mockProduct, 2);

    expect(service.total()).toBe(110.00);
  });

  it('should remove product from cart', () => {
    service.addToCart(mockProduct, 2);
    service.removeFromCart(1);

    expect(service.items().length).toBe(0);
    expect(service.totalItems()).toBe(0);
  });

  it('should update quantity', () => {
    service.addToCart(mockProduct, 2);
    service.updateQuantity(1, 5);

    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalItems()).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    service.addToCart(mockProduct, 2);
    service.updateQuantity(1, 0);

    expect(service.items().length).toBe(0);
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct, 2);
    service.clearCart();

    expect(service.items().length).toBe(0);
    expect(service.totalItems()).toBe(0);
  });
});
