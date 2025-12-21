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
      tax: signal(2.2),
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

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display checkout header with icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('mat-card-title');
      const icon = header?.querySelector('mat-icon');

      expect(header?.textContent).toContain('Checkout');
      expect(icon?.textContent?.trim()).toBe('shopping_cart_checkout');
    });

    it('should display order summary section with cart items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const orderSummary = compiled.querySelector('.order-summary');
      const orderItems = compiled.querySelectorAll('.order-item');

      expect(orderSummary).toBeTruthy();
      expect(orderItems.length).toBe(1);
    });

    it('should display cart item details in order summary', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const orderItem = compiled.querySelector('.order-item');

      expect(orderItem?.textContent).toContain('Test Coffee');
      expect(orderItem?.textContent).toContain('× 2');
    });

    it('should display subtotal, tax, and total in order summary', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const orderTotals = compiled.querySelector('.order-totals');

      expect(orderTotals?.textContent).toContain('Subtotal');
      expect(orderTotals?.textContent).toContain('Tax');
      expect(orderTotals?.textContent).toContain('Total');
    });

    it('should display stepper with form steps', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const stepper = compiled.querySelector('mat-stepper');

      expect(stepper).toBeTruthy();
    });

    it('should display customer info form fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstNameField = compiled.querySelector('input[formControlName="firstName"]');
      const lastNameField = compiled.querySelector('input[formControlName="lastName"]');
      const emailField = compiled.querySelector('input[formControlName="email"]');
      const phoneField = compiled.querySelector('input[formControlName="phone"]');

      expect(firstNameField).toBeTruthy();
      expect(lastNameField).toBeTruthy();
      expect(emailField).toBeTruthy();
      expect(phoneField).toBeTruthy();
    });

    it('should display shipping address form fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const streetField = compiled.querySelector('input[formControlName="street"]');
      const cityField = compiled.querySelector('input[formControlName="city"]');
      const stateField = compiled.querySelector('mat-select[formControlName="state"]');
      const zipCodeField = compiled.querySelector('input[formControlName="zipCode"]');
      const countryField = compiled.querySelector('mat-select[formControlName="country"]');

      expect(streetField).toBeTruthy();
      expect(cityField).toBeTruthy();
      expect(stateField).toBeTruthy();
      expect(zipCodeField).toBeTruthy();
      expect(countryField).toBeTruthy();
    });

    it('should display payment info form fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cardNumberField = compiled.querySelector('input[formControlName="cardNumber"]');
      const cardNameField = compiled.querySelector('input[formControlName="cardName"]');
      const expiryMonthField = compiled.querySelector('mat-select[formControlName="expiryMonth"]');
      const expiryYearField = compiled.querySelector('mat-select[formControlName="expiryYear"]');
      const cvvField = compiled.querySelector('input[formControlName="cvv"]');

      expect(cardNumberField).toBeTruthy();
      expect(cardNameField).toBeTruthy();
      expect(expiryMonthField).toBeTruthy();
      expect(expiryYearField).toBeTruthy();
      expect(cvvField).toBeTruthy();
    });

    it('should display Back to Cart button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('mat-card-actions button');
      const backToCartButton = Array.from(buttons).find(btn => btn.textContent?.includes('Back to Cart'));

      expect(backToCartButton).toBeTruthy();
    });

    it('should display Continue Shopping button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('mat-card-actions button');
      const continueShoppingButton = Array.from(buttons).find(btn => btn.textContent?.includes('Continue Shopping'));

      expect(continueShoppingButton).toBeTruthy();
    });

    it('should navigate to cart when Back to Cart button is clicked', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('mat-card-actions button');
      const backToCartButton = Array.from(buttons).find(btn => btn.textContent?.includes('Back to Cart')) as HTMLButtonElement;

      backToCartButton?.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
    });

    it('should navigate to products when Continue Shopping button is clicked', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('mat-card-actions button');
      const continueShoppingButton = Array.from(buttons).find(btn => btn.textContent?.includes('Continue Shopping')) as HTMLButtonElement;

      continueShoppingButton?.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should display Place Order button with total amount', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton?.textContent).toContain('Place Order');
      expect(submitButton?.textContent).toContain('$24.18');
    });

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(submitButton.disabled).toBeTruthy();
    });
  });

  describe('Order Confirmation View', () => {
    beforeEach(async () => {
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

      // Submit the form
      await component.onSubmit();
      fixture.detectChanges();
    });

    it('should display order confirmed state after successful submission', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const confirmationCard = compiled.querySelector('.confirmation-card');

      expect(confirmationCard).toBeTruthy();
    });

    it('should display Order Confirmed header with check icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('.confirmation-card mat-card-title');
      const icon = header?.querySelector('mat-icon');

      expect(header?.textContent).toContain('Order Confirmed');
      expect(icon?.textContent?.trim()).toBe('check_circle');
    });

    it('should display thank you message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const subtitle = compiled.querySelector('.confirmation-card mat-card-subtitle');

      expect(subtitle?.textContent).toContain('Thank you for your purchase');
    });

    it('should display confirmation content with next steps', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const confirmationContent = compiled.querySelector('.confirmation-content');
      const listItems = compiled.querySelectorAll('.order-details li');

      expect(confirmationContent).toBeTruthy();
      expect(listItems.length).toBe(4);
    });

    it('should display what\'s next heading and list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const orderDetails = compiled.querySelector('.order-details');
      const heading = orderDetails?.querySelector('h3');

      expect(heading?.textContent).toContain("What's next?");
    });

    it('should display Continue Shopping button in confirmation view', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('.confirmation-card mat-card-actions button');

      expect(buttons.length).toBe(1);
      expect(buttons[0].textContent).toContain('Continue Shopping');
    });

    it('should navigate to products when Continue Shopping is clicked in confirmation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const continueButton = compiled.querySelector('.confirmation-card mat-card-actions button') as HTMLButtonElement;

      continueButton?.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should not display checkout form when order is confirmed', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const checkoutCard = compiled.querySelector('.checkout-card');

      expect(checkoutCard).toBeNull();
    });
  });

  describe('Stepper Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display Next button in customer info step', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nextButtons = compiled.querySelectorAll('button[matStepperNext]');

      expect(nextButtons.length).toBeGreaterThan(0);
    });

    it('should display Back button in shipping and payment steps', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const backButtons = compiled.querySelectorAll('button[matStepperPrevious]');

      expect(backButtons.length).toBe(2);
    });
  });

  describe('Form Error Messages Display', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error message for invalid first name', async () => {
      const firstNameControl = component.customerInfo.get('firstName');
      firstNameControl?.setValue('');
      firstNameControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('firstName', 'customerInfo');
      expect(errorMessage).toBe('First name is required');
    });

    it('should show error message for too short first name', () => {
      const firstNameControl = component.customerInfo.get('firstName');
      firstNameControl?.setValue('J');
      firstNameControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('firstName', 'customerInfo');
      expect(errorMessage).toBe('First name is too short');
    });

    it('should show error message for invalid last name', () => {
      const lastNameControl = component.customerInfo.get('lastName');
      lastNameControl?.setValue('');
      lastNameControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('lastName', 'customerInfo');
      expect(errorMessage).toBe('Last name is required');
    });

    it('should show error message for invalid street address', () => {
      const streetControl = component.shippingAddress.get('street');
      streetControl?.setValue('123');
      streetControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('street', 'shippingAddress');
      expect(errorMessage).toBe('Street address is too short');
    });

    it('should show error message for missing city', () => {
      const cityControl = component.shippingAddress.get('city');
      cityControl?.setValue('');
      cityControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('city', 'shippingAddress');
      expect(errorMessage).toBe('City is required');
    });

    it('should show error message for missing state', () => {
      const stateControl = component.shippingAddress.get('state');
      stateControl?.setValue('');
      stateControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('state', 'shippingAddress');
      expect(errorMessage).toBe('State is required');
    });

    it('should show error message for missing country', () => {
      const countryControl = component.shippingAddress.get('country');
      countryControl?.setValue('');
      countryControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('country', 'shippingAddress');
      expect(errorMessage).toBe('Country is required');
    });

    it('should show error message for invalid card number', () => {
      const cardNumberControl = component.paymentInfo.get('cardNumber');
      cardNumberControl?.setValue('1234');
      cardNumberControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('cardNumber', 'paymentInfo');
      expect(errorMessage).toBe('Please enter a valid credit card number');
    });

    it('should show error message for missing card name', () => {
      const cardNameControl = component.paymentInfo.get('cardName');
      cardNameControl?.setValue('');
      cardNameControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('cardName', 'paymentInfo');
      expect(errorMessage).toBe('Cardholder name is required');
    });

    it('should show error message for missing expiry month', () => {
      const expiryMonthControl = component.paymentInfo.get('expiryMonth');
      expiryMonthControl?.setValue('');
      expiryMonthControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('expiryMonth', 'paymentInfo');
      expect(errorMessage).toBe('Expiry month is required');
    });

    it('should show error message for missing expiry year', () => {
      const expiryYearControl = component.paymentInfo.get('expiryYear');
      expiryYearControl?.setValue('');
      expiryYearControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('expiryYear', 'paymentInfo');
      expect(errorMessage).toBe('Expiry year is required');
    });

    it('should show error message for invalid CVV format', () => {
      const cvvControl = component.paymentInfo.get('cvv');
      cvvControl?.setValue('ab');
      cvvControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('cvv', 'paymentInfo');
      expect(errorMessage).toBe('CVV format is invalid');
    });

    it('should show error message for missing CVV', () => {
      const cvvControl = component.paymentInfo.get('cvv');
      cvvControl?.setValue('');
      cvvControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('cvv', 'paymentInfo');
      expect(errorMessage).toBe('CVV is required');
    });

    it('should show error message for invalid zip code', () => {
      const zipCodeControl = component.shippingAddress.get('zipCode');
      zipCodeControl?.setValue('123');
      zipCodeControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('zipCode', 'shippingAddress');
      expect(errorMessage).toBe('Please enter a valid ZIP code');
    });

    it('should show error message for invalid phone number', () => {
      const phoneControl = component.customerInfo.get('phone');
      phoneControl?.setValue('abc');
      phoneControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('phone', 'customerInfo');
      expect(errorMessage).toBe('Please enter a valid phone number');
    });

    it('should return Invalid input for unknown error type', () => {
      // This tests the fallback case in getErrorMessage
      const control = component.customerInfo.get('firstName');
      // Manually set an unknown error type
      control?.setErrors({ unknownError: true });
      control?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = component.getErrorMessage('firstName', 'customerInfo');
      expect(errorMessage).toBe('Invalid input');
    });
  });

  describe('Submit Button States', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show spinner when submitting', async () => {
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
      fixture.detectChanges();

      // Start submission (don't await to check isSubmitting state)
      const submitPromise = component.onSubmit();
      fixture.detectChanges();

      expect(component.isSubmitting()).toBe(true);

      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('button[type="submit"] mat-spinner');
      const buttonText = compiled.querySelector('button[type="submit"]')?.textContent;

      expect(spinner).toBeTruthy();
      expect(buttonText).toContain('Processing');

      await submitPromise;
    });

    it('should enable submit button when form is valid', () => {
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
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(submitButton.disabled).toBeFalsy();
    });
  });

  describe('Card Number Input Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format card number on input via onCardNumberChange', () => {
      const mockEvent = {
        target: {
          value: '1234567890123456'
        }
      } as unknown as Event;

      component.onCardNumberChange(mockEvent);

      expect(component.paymentInfo.get('cardNumber')?.value).toBe('1234 5678 9012 3456');
    });

    it('should handle empty card number input', () => {
      const formatted = component.formatCardNumber('');
      expect(formatted).toBe('');
    });

    it('should handle card number with spaces', () => {
      const formatted = component.formatCardNumber('1234 5678 9012 3456');
      expect(formatted).toBe('1234 5678 9012 3456');
    });
  });

  describe('Select Options', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have countries list available', () => {
      expect(component.countries.length).toBeGreaterThan(0);
      expect(component.countries.find(c => c.code === 'US')).toBeTruthy();
    });

    it('should have states list available', () => {
      expect(component.states.length).toBe(50);
      expect(component.states).toContain('California');
    });

    it('should have months list available', () => {
      expect(component.months.length).toBe(12);
      expect(component.months[0]).toEqual({ value: '01', name: '01 - January' });
    });

    it('should have years list with 10 future years', () => {
      expect(component.years.length).toBe(10);
      const currentYear = new Date().getFullYear();
      expect(component.years[0].value).toBe(currentYear.toString());
    });
  });
});
