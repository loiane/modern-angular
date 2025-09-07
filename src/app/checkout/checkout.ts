import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { NotificationService } from '../shared/services/notification.service';

// Strongly typed interfaces
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    CurrencyPipe
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // Signals for component state
  isSubmitting = signal(false);
  orderConfirmed = signal(false);

  // Expose cart service for template
  get cart() {
    return this.cartService;
  }

  // Strongly typed form group
  checkoutForm: FormGroup;

  // Available countries and states
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' }
  ];

  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  months = [
    { value: '01', name: '01 - January' },
    { value: '02', name: '02 - February' },
    { value: '03', name: '03 - March' },
    { value: '04', name: '04 - April' },
    { value: '05', name: '05 - May' },
    { value: '06', name: '06 - June' },
    { value: '07', name: '07 - July' },
    { value: '08', name: '08 - August' },
    { value: '09', name: '09 - September' },
    { value: '10', name: '10 - October' },
    { value: '11', name: '11 - November' },
    { value: '12', name: '12 - December' }
  ];

  years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), name: year.toString() };
  });

  constructor() {
    // Initialize the strongly typed reactive form
    this.checkoutForm = this.fb.group({
      customerInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, this.phoneValidator]]
      }),
      shippingAddress: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, this.zipCodeValidator]],
        country: ['US', Validators.required]
      }),
      paymentInfo: this.fb.group({
        cardNumber: ['', [Validators.required, this.creditCardValidator]],
        cardName: ['', [Validators.required, Validators.minLength(2)]],
        expiryMonth: ['', Validators.required],
        expiryYear: ['', Validators.required],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
      })
    });

    // Check if cart is empty and redirect if needed
    if (this.cartService.isEmpty()) {
      this.notificationService.showError('Your cart is empty. Add some items before checkout.');
      // Use setTimeout to avoid async operation in constructor
      setTimeout(() => this.router.navigate(['/products']), 0);
    }
  }

  // Custom validators
  private phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const phonePattern = /^[+]?[1-9]\d{0,15}$/;
    if (control.value && !phonePattern.test(control.value.replace(/\s/g, ''))) {
      return { invalidPhone: true };
    }
    return null;
  }

  private zipCodeValidator(control: AbstractControl): { [key: string]: any } | null {
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (control.value && !zipPattern.test(control.value)) {
      return { invalidZipCode: true };
    }
    return null;
  }

  private creditCardValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;

    // Remove spaces and dashes
    const cardNumber = control.value.replace(/[\s-]/g, '');

    // Check if it's all digits
    if (!/^\d+$/.test(cardNumber)) {
      return { invalidCreditCard: true };
    }

    // Check length (13-19 digits for most cards)
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return { invalidCreditCard: true };
    }

    // Luhn algorithm check
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    if (sum % 10 !== 0) {
      return { invalidCreditCard: true };
    }

    return null;
  }

  // Helper methods for form field access
  get customerInfo() {
    return this.checkoutForm.get('customerInfo')!;
  }

  get shippingAddress() {
    return this.checkoutForm.get('shippingAddress')!;
  }

  get paymentInfo() {
    return this.checkoutForm.get('paymentInfo')!;
  }

  // Format card number display
  formatCardNumber(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/\D/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
  }

  // Handle card number input formatting
  onCardNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.formatCardNumber(input.value);
    input.value = formatted;
    this.paymentInfo.get('cardNumber')?.setValue(formatted);
  }

  // Mock order submission
  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.showError('Please fill in all required fields correctly.');
      return;
    }

    if (this.cartService.isEmpty()) {
      this.notificationService.showError('Your cart is empty.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success response
      const orderData = {
        ...this.checkoutForm.value,
        orderId: this.generateOrderId(),
        items: this.cartService.items(),
        total: this.cartService.total(),
        orderDate: new Date().toISOString()
      };

      console.log('Order submitted:', orderData);

      // Clear the cart after successful order
      this.cartService.clearCart();

      // Show success state
      this.orderConfirmed.set(true);
      this.notificationService.showSuccess('Order placed successfully! Order ID: ' + orderData.orderId);

    } catch (error) {
      this.notificationService.showError('Failed to place order. Please try again.');
      console.error('Order submission failed:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Generate mock order ID
  private generateOrderId(): string {
    return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Navigation methods
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  // Helper method to get error message for form fields
  getErrorMessage(controlName: string, groupName?: string): string {
    let control: AbstractControl | null;

    if (groupName) {
      control = this.checkoutForm.get(`${groupName}.${controlName}`);
    } else {
      control = this.checkoutForm.get(controlName);
    }

    if (!control?.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) return `${this.getFieldDisplayName(controlName)} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `${this.getFieldDisplayName(controlName)} is too short`;
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    if (errors['invalidZipCode']) return 'Please enter a valid ZIP code';
    if (errors['invalidCreditCard']) return 'Please enter a valid credit card number';
    if (errors['pattern']) return `${this.getFieldDisplayName(controlName)} format is invalid`;

    return 'Invalid input';
  }

  private getFieldDisplayName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      street: 'Street address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP code',
      country: 'Country',
      cardNumber: 'Card number',
      cardName: 'Cardholder name',
      expiryMonth: 'Expiry month',
      expiryYear: 'Expiry year',
      cvv: 'CVV'
    };

    return fieldNames[controlName] || controlName;
  }
}
