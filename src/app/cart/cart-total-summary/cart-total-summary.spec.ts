import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CartTotalSummaryComponent } from './cart-total-summary';
import { CartService } from '../cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CartItem } from '../cart-item';

describe('CartTotalSummaryComponent', () => {
  let component: CartTotalSummaryComponent;
  let fixture: ComponentFixture<CartTotalSummaryComponent>;
  let mockCartService: jest.Mocked<CartService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: 1,
          name: 'Test Product 1',
          description: 'Description 1',
          price: 10.99,
          image: 'image1.jpg',
          rating: 4.5,
          reviewCount: 10,
          category: 'Electronics'
        },
        quantity: 2
      }
    ];

    mockCartService = {
      items: signal(mockCartItems),
      totalItems: signal(3),
      subtotal: signal(21.98),
      tax: signal(2.20),
      total: signal(24.18),
      isEmpty: jest.fn().mockReturnValue(false),
      clearCart: jest.fn(),
      getTotal: jest.fn().mockReturnValue(21.98),
      getItemCount: jest.fn().mockReturnValue(2),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn()
    } as any;

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showInfo: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartTotalSummaryComponent, NoopAnimationsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartTotalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose cart service', () => {
    expect(component.cart).toBe(mockCartService);
  });

  describe('proceedToCheckout', () => {
    it('should show info message when proceeding to checkout with items', () => {
      mockCartService.isEmpty.mockReturnValue(false);

      component.proceedToCheckout();

      expect(mockNotificationService.showInfo).toHaveBeenCalledWith('Checkout functionality will be implemented soon!');
    });

    it('should show error message when trying to checkout with empty cart', () => {
      mockCartService.isEmpty.mockReturnValue(true);

      component.proceedToCheckout();

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Your cart is empty. Add some items before checkout.');
      expect(mockNotificationService.showInfo).not.toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it('should clear cart and show success message when cart has items', () => {
      mockCartService.isEmpty.mockReturnValue(false);

      component.clearCart();

      expect(mockCartService.clearCart).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Cart cleared successfully!');
    });

    it('should show info message when trying to clear empty cart', () => {
      mockCartService.isEmpty.mockReturnValue(true);

      component.clearCart();

      expect(mockCartService.clearCart).not.toHaveBeenCalled();
      expect(mockNotificationService.showInfo).toHaveBeenCalledWith('Your cart is already empty.');
    });
  });
});
