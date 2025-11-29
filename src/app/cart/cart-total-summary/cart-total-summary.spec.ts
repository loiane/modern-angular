import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

import { CartTotalSummaryComponent } from './cart-total-summary';
import { CartService } from '../cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CartItem } from '../cart-item';

describe('CartTotalSummaryComponent', () => {
  let component: CartTotalSummaryComponent;
  let fixture: ComponentFixture<CartTotalSummaryComponent>;
  let mockCartService: any;
  let mockNotificationService: any;
  let mockRouter: any;

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
      tax: signal(2.2),
      total: signal(24.18),
      isEmpty: vi.fn().mockReturnValue(false),
      clearCart: vi.fn(),
      getTotal: vi.fn().mockReturnValue(21.98),
      getItemCount: vi.fn().mockReturnValue(2),
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn()
    } as any;

    mockNotificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn()
    } as any;

    mockRouter = {
      navigate: vi.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartTotalSummaryComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter }
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
    it('should navigate to checkout when cart has items', () => {
      mockCartService.isEmpty.mockReturnValue(false);

      component.proceedToCheckout();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
    });

    it('should show error message when trying to checkout with empty cart', () => {
      mockCartService.isEmpty.mockReturnValue(true);

      component.proceedToCheckout();

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Your cart is empty. Add some items before checkout.');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
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
