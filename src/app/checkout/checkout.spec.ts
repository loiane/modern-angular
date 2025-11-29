import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CheckoutComponent } from './checkout';
import { CartService } from '../cart/cart.service';
import { NotificationService } from '../shared/services/notification.service';
import { Product } from '../products/product';
import { CartItem } from '../cart/cart-item';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockCartService: any;
  let mockNotificationService: any;
  let mockRouter: any;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Coffee',
    description: 'Test description',
    price: 10.99,
    image: 'test.jpg',
    category: 'coffee',
    rating: 4.5,
    reviewCount: 10,
    isOnSale: false,
    originalPrice: undefined
  };

  const mockCartItems: CartItem[] = [
    { product: mockProduct, quantity: 2 }
  ];

  beforeEach(async () => {
    mockCartService = {
      isEmpty: vi.fn().mockReturnValue(false),
      items: signal(mockCartItems),
      subtotal: signal(21.98),
      tax: signal(2.20),
      total: signal(24.18),
      totalItems: signal(2),
      clearCart: vi.fn(),
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getItemQuantity: vi.fn(),
      isInCart: vi.fn()
    } as any;

    mockNotificationService = {
      showError: vi.fn(),
      showSuccess: vi.fn(),
      showInfo: vi.fn()
    } as any;

    mockRouter = {
      navigate: vi.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatStepperModule,
        MatSelectModule,
        MatDividerModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should initialize with empty form', () => {
      expect(component.checkoutForm).toBeDefined();
      expect(component.customerInfo.get('firstName')?.value).toBe('');
      expect(component.customerInfo.get('lastName')?.value).toBe('');
      expect(component.customerInfo.get('email')?.value).toBe('');
      expect(component.customerInfo.get('phone')?.value).toBe('');
    });

    it('should initialize shipping address with default country', () => {
      expect(component.shippingAddress.get('country')?.value).toBe('US');
      expect(component.shippingAddress.get('street')?.value).toBe('');
      expect(component.shippingAddress.get('city')?.value).toBe('');
    });

    it('should initialize payment info fields as empty', () => {
      expect(component.paymentInfo.get('cardNumber')?.value).toBe('');
      expect(component.paymentInfo.get('cardName')?.value).toBe('');
      expect(component.paymentInfo.get('cvv')?.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      const firstName = component.customerInfo.get('firstName');
      expect(firstName?.valid).toBeFalsy();

      firstName?.setValue('John');
      expect(firstName?.valid).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.customerInfo.get('email');

      email?.setValue('invalid-email');
      expect(email?.valid).toBeFalsy();

      email?.setValue('john@example.com');
      expect(email?.valid).toBeTruthy();
    });

    it('should validate phone number', () => {
      const phone = component.customerInfo.get('phone');

      phone?.setValue('invalid');
      expect(phone?.valid).toBeFalsy();

      phone?.setValue('1234567890');
      expect(phone?.valid).toBeTruthy();
    });

    it('should validate ZIP code', () => {
      const zipCode = component.shippingAddress.get('zipCode');

      zipCode?.setValue('invalid');
      expect(zipCode?.valid).toBeFalsy();

      zipCode?.setValue('12345');
      expect(zipCode?.valid).toBeTruthy();

      zipCode?.setValue('12345-6789');
      expect(zipCode?.valid).toBeTruthy();
    });

    it('should validate credit card number', () => {
      const cardNumber = component.paymentInfo.get('cardNumber');

      cardNumber?.setValue('1234');
      expect(cardNumber?.valid).toBeFalsy();

      // Valid credit card number (test number)
      cardNumber?.setValue('4532015112830366');
      expect(cardNumber?.valid).toBeTruthy();
    });

    it('should validate CVV', () => {
      const cvv = component.paymentInfo.get('cvv');

      cvv?.setValue('12');
      expect(cvv?.valid).toBeFalsy();

      cvv?.setValue('123');
      expect(cvv?.valid).toBeTruthy();

      cvv?.setValue('1234');
      expect(cvv?.valid).toBeTruthy();
    });
  });

  describe('Card Number Formatting', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format card number with spaces', () => {
      const formatted = component.formatCardNumber('1234567890123456');
      expect(formatted).toBe('1234 5678 9012 3456');
    });

    it('should handle partial card numbers', () => {
      const formatted = component.formatCardNumber('123456');
      expect(formatted).toBe('1234 56');
    });

    it('should remove non-numeric characters', () => {
      const formatted = component.formatCardNumber('1234-5678-9012-3456');
      expect(formatted).toBe('1234 5678 9012 3456');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate back to cart', () => {
      component.goBackToCart();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
    });

    it('should navigate to products for continue shopping', () => {
      component.continueShopping();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Fill form with valid data
      component.customerInfo.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });
      component.shippingAddress.patchValue({
        street: '123 Main St',
        city: 'Anytown',
        state: 'California',
        zipCode: '12345',
        country: 'US'
      });
      component.paymentInfo.patchValue({
        cardNumber: '4532015112830366',
        cardName: 'John Doe',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      });
    });

    it('should prevent submission with invalid form', async () => {
      component.customerInfo.get('firstName')?.setValue('');

      await component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Please fill in all required fields correctly.'
      );
    });

    it('should prevent submission with empty cart', async () => {
      mockCartService.isEmpty.mockReturnValue(true);

      await component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Your cart is empty.');
    });

    it('should submit valid order successfully', async () => {
      const submitPromise = component.onSubmit();

      expect(component.isSubmitting()).toBeTruthy();

      await submitPromise;

      expect(component.orderConfirmed()).toBeTruthy();
      expect(mockCartService.clearCart).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        expect.stringMatching(/Order placed successfully! Order ID: ORD-/)
      );
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return correct error message for required fields', () => {
      const firstName = component.customerInfo.get('firstName');
      firstName?.markAsTouched();
      firstName?.setValue('');

      const errorMessage = component.getErrorMessage('firstName', 'customerInfo');
      expect(errorMessage).toBe('First name is required');
    });

    it('should return correct error message for invalid email', () => {
      const email = component.customerInfo.get('email');
      email?.markAsTouched();
      email?.setValue('invalid-email');

      const errorMessage = component.getErrorMessage('email', 'customerInfo');
      expect(errorMessage).toBe('Please enter a valid email address');
    });

    it('should return empty string for untouched fields', () => {
      const errorMessage = component.getErrorMessage('firstName', 'customerInfo');
      expect(errorMessage).toBe('');
    });
  });

  describe('Empty Cart Handling', () => {
    it('should redirect to products if cart is empty on initialization', async () => {
      mockCartService.isEmpty.mockReturnValue(true);

      fixture.detectChanges();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Your cart is empty. Add some items before checkout.'
      );

      // Wait for navigation to be called after timeout
      await vi.waitFor(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
      });
    });
  });

  describe('Order ID Generation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should generate unique order IDs', () => {
      const orderId1 = (component as any).generateOrderId();
      const orderId2 = (component as any).generateOrderId();

      expect(orderId1).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]{4}$/);
      expect(orderId2).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]{4}$/);
      expect(orderId1).not.toBe(orderId2);
    });
  });
});
