import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProductList } from './product-list';
import { ProductService } from '../product-service';
import { CartService } from '../../cart/cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Product } from '../product';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockCartService: jest.Mocked<CartService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    // Create mock products
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 10.99,
        image: 'image1.jpg',
        rating: 4.5,
        reviewCount: 10,
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'Test Product 2',
        description: 'Description 2',
        price: 20.99,
        image: 'image2.jpg',
        rating: 4.0,
        reviewCount: 5,
        category: 'Books'
      }
    ];

    // Create a mock HttpResourceRef that matches the expected interface
    const createMockHttpResourceRef = (value: Product[] | null, loading = false, error: any = null) => ({
      value: signal(value),
      isLoading: signal(loading),
      error: signal(error),
      headers: signal(undefined),
      statusCode: signal(200),
      progress: signal(null),
      hasValue: signal(value !== null),
      reload: jest.fn(),
      request: jest.fn(),
      destroy: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      asReadonly: jest.fn(),
      status: signal('resolved' as any)
    });

    mockProductService = {
      getProducts: jest.fn().mockReturnValue(createMockHttpResourceRef(mockProducts))
    } as any;

    mockCartService = {
      addToCart: jest.fn().mockReturnValue({ success: true, message: 'Item added successfully' }),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotal: jest.fn().mockReturnValue(0),
      getItemCount: jest.fn().mockReturnValue(0),
      items: signal([])
    } as any;

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showInfo: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductList, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products when loaded', () => {
    expect(component.products()).toHaveLength(2);
    expect(component.products()[0].name).toBe('Test Product 1');
    expect(component.products()[1].name).toBe('Test Product 2');
  });

  it('should show loading state initially', () => {
    expect(component.isLoading()).toBe(false); // Since we're mocking with loaded data
  });

  it('should handle error state', () => {
    const errorMessage = 'Failed to load products';
    const errorResource = {
      value: signal(null),
      isLoading: signal(false),
      error: signal(new Error(errorMessage)),
      headers: signal(undefined),
      statusCode: signal(500),
      progress: signal(null),
      hasValue: signal(false),
      reload: jest.fn(),
      request: jest.fn(),
      destroy: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      asReadonly: jest.fn(),
      status: signal('resolved' as any)
    };

    mockProductService.getProducts.mockReturnValue(errorResource as any);

    // Create a new component instance to test error state
    const errorFixture = TestBed.createComponent(ProductList);
    const errorComponent = errorFixture.componentInstance;
    errorFixture.detectChanges();

    expect(errorComponent.hasError()).toBe(true);
    expect(errorComponent.errorMessage()).toContain('Failed to load products');
  });

  it('should retry loading when retryLoading is called', () => {
    const reloadSpy = jest.fn();
    const resourceWithReload = {
      value: signal(null),
      isLoading: signal(false),
      error: signal(new Error('Load failed')),
      headers: signal(undefined),
      statusCode: signal(500),
      progress: signal(null),
      hasValue: signal(false),
      reload: reloadSpy,
      request: jest.fn(),
      destroy: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      asReadonly: jest.fn(),
      status: signal('resolved' as any)
    };

    mockProductService.getProducts.mockReturnValue(resourceWithReload as any);

    const retryFixture = TestBed.createComponent(ProductList);
    const retryComponent = retryFixture.componentInstance;

    retryComponent.retryLoading();

    expect(reloadSpy).toHaveBeenCalled();
  });

  describe('addToCart', () => {
    it('should add product to cart successfully and show success notification', () => {
      const testProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        rating: 4.5,
        reviewCount: 10,
        category: 'Test'
      };

      mockCartService.addToCart.mockReturnValue({ success: true, message: 'Item added successfully' });

      component.addToCart(testProduct);

      expect(mockCartService.addToCart).toHaveBeenCalledWith(testProduct, 1);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Test Product added to cart!');
    });

    it('should handle cart addition failure and show error notification', () => {
      const testProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        rating: 4.5,
        reviewCount: 10,
        category: 'Test'
      };

      const errorMessage = 'Cart is full';
      mockCartService.addToCart.mockReturnValue({ success: false, message: errorMessage });

      component.addToCart(testProduct);

      expect(mockCartService.addToCart).toHaveBeenCalledWith(testProduct, 1);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle cart addition failure with generic message when no specific error', () => {
      const testProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        rating: 4.5,
        reviewCount: 10,
        category: 'Test'
      };

      mockCartService.addToCart.mockReturnValue({ success: false, message: 'Unknown error' });

      component.addToCart(testProduct);

      expect(mockCartService.addToCart).toHaveBeenCalledWith(testProduct, 1);
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Unknown error');
    });
  });
});
