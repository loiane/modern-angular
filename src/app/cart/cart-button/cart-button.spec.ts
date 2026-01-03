import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartButton } from './cart-button';
import { CartService } from '../cart.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('CartButton', () => {
  let component: CartButton;
  let fixture: ComponentFixture<CartButton>;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    const mockCartService = {
      totalItems: signal(0)
    };

    await TestBed.configureTestingModule({
      imports: [CartButton],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartButton);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct aria-label with no items', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Cart with 0 items. Open cart');
  });

  it('should display correct aria-label with one item', () => {
    cartService.totalItems.set(1);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Cart with 1 item. Open cart');
  });

  it('should display correct aria-label with multiple items', () => {
    cartService.totalItems.set(5);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Cart with 5 items. Open cart');
  });

  it('should hide badge when cart is empty', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.getAttribute('ng-reflect-hide')).toBe('true');
  });

  it('should show badge when cart has items', () => {
    cartService.totalItems.set(3);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.getAttribute('ng-reflect-hide')).toBe('false');
  });

  it('should display correct screen reader text when empty', () => {
    const srText = fixture.nativeElement.querySelector('.sr-only');
    expect(srText.textContent.trim()).toBe('Cart is empty');
  });

  it('should display correct screen reader text with one item', () => {
    cartService.totalItems.set(1);
    fixture.detectChanges();

    const srText = fixture.nativeElement.querySelector('.sr-only');
    expect(srText.textContent.trim()).toBe('1 item in cart');
  });

  it('should display correct screen reader text with multiple items', () => {
    cartService.totalItems.set(4);
    fixture.detectChanges();

    const srText = fixture.nativeElement.querySelector('.sr-only');
    expect(srText.textContent.trim()).toBe('4 items in cart');
  });
});
