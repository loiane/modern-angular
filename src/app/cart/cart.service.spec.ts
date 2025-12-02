import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../products/product';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 50,
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
    expect(service.isEmpty()).toBe(true);
  });

  describe('addToCart', () => {
    it('should add product to cart successfully', () => {
      const result = service.addToCart(mockProduct, 2);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Item added to cart successfully');
      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(1);
      expect(service.items()[0].quantity).toBe(2);
      expect(service.totalItems()).toBe(2);
      expect(service.isEmpty()).toBe(false);
    });

    it('should update quantity of existing product', () => {
      service.addToCart(mockProduct, 1);
      const result = service.addToCart(mockProduct, 2);

      expect(result.success).toBe(true);
      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
      expect(service.totalItems()).toBe(3);
    });

    it('should reject invalid product', () => {
      const result = service.addToCart(null as any, 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid product');
      expect(service.items().length).toBe(0);
    });

    it('should reject product without id', () => {
      const invalidProduct = { ...mockProduct, id: undefined as any };
      const result = service.addToCart(invalidProduct, 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid product');
    });

    it('should reject zero quantity', () => {
      const result = service.addToCart(mockProduct, 0);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Quantity must be greater than 0');
    });

    it('should reject negative quantity', () => {
      const result = service.addToCart(mockProduct, -1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Quantity must be greater than 0');
    });

    it('should reject quantity exceeding maximum', () => {
      const result = service.addToCart(mockProduct, 100);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cannot add more than 99 items');
    });

    it('should reject adding to existing item if total exceeds maximum', () => {
      service.addToCart(mockProduct, 95);
      const result = service.addToCart(mockProduct, 10);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cannot add more than 99 items of the same product');
    });

    it('should reject when cart is full (50 items)', () => {
      // Add 50 different products
      for (let i = 1; i <= 50; i++) {
        const product = { ...mockProduct, id: i };
        service.addToCart(product, 1);
      }

      const newProduct = { ...mockProduct, id: 51 };
      const result = service.addToCart(newProduct, 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cart is full. Remove items to add new ones.');
    });

    it('should handle unexpected errors during addToCart', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by making the signal throw
      vi.spyOn(service['cartItems'], 'set').mockImplementationOnce(() => {
        throw new Error('Simulated error');
      });

      const result = service.addToCart(mockProduct, 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to add item to cart');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding item to cart:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 2);
    });

    it('should remove item from cart successfully', () => {
      const result = service.removeFromCart(1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Item removed from cart');
      expect(service.items().length).toBe(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should handle removing non-existent item', () => {
      const result = service.removeFromCart(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Item not found in cart');
      expect(service.items().length).toBe(1);
    });

    it('should reject invalid product ID', () => {
      const result = service.removeFromCart(null as any);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid product ID');
    });

    it('should handle unexpected errors during removeFromCart', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by making the signal throw
      vi.spyOn(service['cartItems'], 'set').mockImplementationOnce(() => {
        throw new Error('Simulated error');
      });

      const result = service.removeFromCart(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to remove item from cart');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing item from cart:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 5);
    });

    it('should update quantity successfully', () => {
      const result = service.updateQuantity(1, 3);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Quantity updated successfully');
      expect(service.items()[0].quantity).toBe(3);
      expect(service.totalItems()).toBe(3);
    });

    it('should remove item when quantity is 0', () => {
      const result = service.updateQuantity(1, 0);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Item removed from cart');
      expect(service.items().length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const result = service.updateQuantity(1, -1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Item removed from cart');
      expect(service.items().length).toBe(0);
    });

    it('should reject quantity exceeding maximum', () => {
      const result = service.updateQuantity(1, 100);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Quantity cannot exceed 99');
      expect(service.items()[0].quantity).toBe(5); // Should remain unchanged
    });

    it('should handle updating non-existent item', () => {
      const result = service.updateQuantity(999, 3);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Item not found in cart');
    });

    it('should reject invalid product ID', () => {
      const result = service.updateQuantity(null as any, 3);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid product ID');
    });

    it('should handle unexpected errors during updateQuantity', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by making the signal throw
      vi.spyOn(service['cartItems'], 'set').mockImplementationOnce(() => {
        throw new Error('Simulated error');
      });

      const result = service.updateQuantity(1, 3);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to update quantity');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating cart quantity:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      service.addToCart(mockProduct, 3);
    });

    it('should return correct item quantity', () => {
      expect(service.getItemQuantity(1)).toBe(3);
      expect(service.getItemQuantity(999)).toBe(0);
    });

    it('should check if item is in cart', () => {
      expect(service.isInCart(1)).toBe(true);
      expect(service.isInCart(999)).toBe(false);
    });
  });

  it('should calculate correct subtotal', () => {
    service.addToCart(mockProduct, 2);

    expect(service.subtotal()).toBe(100);
  });

  it('should calculate correct tax (10%)', () => {
    service.addToCart(mockProduct, 2);

    expect(service.tax()).toBe(10);
  });

  it('should calculate correct total', () => {
    service.addToCart(mockProduct, 2);

    expect(service.total()).toBe(110);
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
