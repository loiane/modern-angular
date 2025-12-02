import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CartListComponent } from './cart-list';
import { CartService } from '../cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CartItem } from '../cart-item';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let mockCartService: any;
  let mockNotificationService: any;

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
      },
      {
        product: {
          id: 2,
          name: 'Test Product 2',
          description: 'Description 2',
          price: 20.99,
          image: 'image2.jpg',
          rating: 4,
          reviewCount: 5,
          category: 'Books'
        },
        quantity: 1
      }
    ];

    mockCartService = {
      items: signal(mockCartItems),
      isEmpty: signal(false), // Add the missing isEmpty signal
      addToCart: vi.fn().mockReturnValue({ success: true, message: 'Item added successfully' }),
      removeFromCart: vi.fn().mockReturnValue({ success: true, message: 'Item removed successfully' }),
      updateQuantity: vi.fn().mockReturnValue({ success: true, message: 'Quantity updated successfully' }),
      clearCart: vi.fn(),
      getTotal: vi.fn().mockReturnValue(42.97),
      getItemCount: vi.fn().mockReturnValue(3)
    } as any;

    mockNotificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartListComponent, FormsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should expose cart service', () => {
    fixture.detectChanges();
    expect(component.cart).toBe(mockCartService);
  });

  describe('updateQuantity', () => {
    it('should update quantity successfully without showing notification', () => {
      mockCartService.updateQuantity.mockReturnValue({ success: true, message: 'Quantity updated' });

      component.updateQuantity(1, '3');

      expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 3);
      expect(mockNotificationService.showSuccess).not.toHaveBeenCalled();
    });

    it('should update quantity via input change event', () => {
      fixture.detectChanges();
      mockCartService.updateQuantity.mockReturnValue({ success: true, message: 'Quantity updated' });

      const compiled = fixture.nativeElement as HTMLElement;
      const quantityInput = compiled.querySelector('input[type="number"]') as HTMLInputElement;

      expect(quantityInput).toBeTruthy();

      quantityInput.value = '5';
      quantityInput.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('should handle invalid quantity input and show error notification', () => {
      component.updateQuantity(1, 'invalid');

      expect(mockCartService.updateQuantity).not.toHaveBeenCalled();
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Please enter a valid quantity');
    });

    it('should handle negative quantity input and show error notification', () => {
      component.updateQuantity(1, '-1');

      expect(mockCartService.updateQuantity).not.toHaveBeenCalled();
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Please enter a valid quantity');
    });

    it('should handle update failure and show error notification', () => {
      const errorMessage = 'Cannot update quantity';
      mockCartService.updateQuantity.mockReturnValue({ success: false, message: errorMessage });

      component.updateQuantity(1, '5');

      expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 5);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('removeItem', () => {
    it('should remove item successfully and show success notification', () => {
      mockCartService.removeFromCart.mockReturnValue({ success: true, message: 'Item removed' });

      component.removeItem(1);

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Item removed from cart');
    });

    it('should remove item via delete button click', () => {
      fixture.detectChanges();
      mockCartService.removeFromCart.mockReturnValue({ success: true, message: 'Item removed' });

      const compiled = fixture.nativeElement as HTMLElement;
      const deleteButton = compiled.querySelector('button[aria-label="Remove item"]') as HTMLButtonElement;

      expect(deleteButton).toBeTruthy();

      deleteButton.click();
      fixture.detectChanges();

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Item removed from cart');
    });

    it('should handle remove failure and show error notification', () => {
      const errorMessage = 'Cannot remove item';
      mockCartService.removeFromCart.mockReturnValue({ success: false, message: errorMessage });

      component.removeItem(1);

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
