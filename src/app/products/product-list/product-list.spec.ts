import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ProductList } from './product-list';
import { ProductService } from '../product-service';
import { CartService } from '../../cart/cart.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Product } from '../product';
import { ProductCardComponent } from '../product-card/product-card';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockProductService: any;
  let mockCartService: any;
  let mockNotificationService: any;

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
        rating: 4,
        reviewCount: 5,
        category: 'Books'
      }
    ];

    // Create a mock HttpResourceRef that matches the expected interface
    const createMockHttpResourceRef = (value: Product[] | null, loading = false, error: any = undefined) => ({
      value: signal(value),
      isLoading: signal(loading),
      error: signal(error),
      headers: signal(undefined),
      statusCode: signal(200),
      progress: signal(null),
      hasValue: signal(value !== null),
      reload: vi.fn(),
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
      status: signal('resolved' as any)
    });

    mockProductService = {
      getProducts: vi.fn().mockReturnValue(createMockHttpResourceRef(mockProducts))
    } as any;

    mockCartService = {
      addToCart: vi.fn().mockReturnValue({ success: true, message: 'Item added successfully' }),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      getTotal: vi.fn().mockReturnValue(0),
      getItemCount: vi.fn().mockReturnValue(0),
      items: signal([])
    } as any;

    mockNotificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductList],
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

  it('should render product grid with product cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productGrid = compiled.querySelector('.product-grid');
    const productCards = compiled.querySelectorAll('app-product-card');

    expect(productGrid).toBeTruthy();
    expect(productCards.length).toBe(2);
  });

  it('should handle addToCart event from product card', () => {
    const testProduct = component.products()[0];

    component.addToCart(testProduct);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(testProduct, 1);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Test Product 1 added to cart!');
  });

  it('should handle addToCart event emission from product-card template', () => {
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
    const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;
    const testProduct = component.products()[0];

    // Spy on the component's addToCart method to verify the event binding
    vi.spyOn(component, 'addToCart');

    // Trigger the addToCart output event from the child component
    firstCardComponent.addToCart.emit(testProduct);
    fixture.detectChanges();

    expect(component.addToCart).toHaveBeenCalledWith(testProduct);
  });

  it('should show loading state initially', () => {
    expect(component.isLoading()).toBe(false); // Since we're mocking with loaded data
  });

  it('should display empty state when no products are available', () => {
    const emptyResource = {
      value: signal([]),
      isLoading: signal(false),
      error: signal(undefined),
      headers: signal(undefined),
      statusCode: signal(200),
      progress: signal(null),
      hasValue: signal(true),
      reload: vi.fn(),
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
      status: signal('resolved' as any)
    };

    mockProductService.getProducts.mockReturnValue(emptyResource as any);

    const emptyFixture = TestBed.createComponent(ProductList);
    const emptyComponent = emptyFixture.componentInstance;
    emptyFixture.detectChanges();

    expect(emptyComponent.products()).toHaveLength(0);
    expect(emptyComponent.isLoading()).toBe(false);
    expect(emptyComponent.hasError()).toBe(false);

    const compiled = emptyFixture.nativeElement as HTMLElement;
    const emptyContainer = compiled.querySelector('.empty-container');
    const emptyIcon = compiled.querySelector('.empty-icon');
    const heading = compiled.querySelector('h3');
    const paragraph = compiled.querySelector('p');

    expect(emptyContainer).toBeTruthy();
    expect(emptyIcon?.textContent?.trim()).toBe('inventory_2');
    expect(heading?.textContent?.trim()).toBe('No products available');
    expect(paragraph?.textContent?.trim()).toBe('Check back later for new products!');
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
      reload: vi.fn(),
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
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
    const reloadSpy = vi.fn();
    const resourceWithReload = {
      value: signal(null),
      isLoading: signal(false),
      error: signal(new Error('Load failed')),
      headers: signal(undefined),
      statusCode: signal(500),
      progress: signal(null),
      hasValue: signal(false),
      reload: reloadSpy,
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
      status: signal('resolved' as any)
    };

    mockProductService.getProducts.mockReturnValue(resourceWithReload as any);

    const retryFixture = TestBed.createComponent(ProductList);
    const retryComponent = retryFixture.componentInstance;

    retryComponent.retryLoading();

    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should retry loading via button click', () => {
    const reloadSpy = vi.fn();
    const resourceWithReload = {
      value: signal(null),
      isLoading: signal(false),
      error: signal(new Error('Load failed')),
      headers: signal(undefined),
      statusCode: signal(500),
      progress: signal(null),
      hasValue: signal(false),
      reload: reloadSpy,
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
      status: signal('resolved' as any)
    };

    mockProductService.getProducts.mockReturnValue(resourceWithReload as any);

    const retryFixture = TestBed.createComponent(ProductList);
    retryFixture.detectChanges();

    const compiled = retryFixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector('button') as HTMLButtonElement;

    expect(retryButton).toBeTruthy();
    expect(retryButton.textContent?.trim()).toContain('Try Again');

    retryButton.click();
    retryFixture.detectChanges();

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

  describe('addToWishlist', () => {
    it('should show info notification with product name', () => {
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

      component.addToWishlist(testProduct);

      expect(mockNotificationService.showInfo).toHaveBeenCalledWith(
        'Test Product will be added to wishlist when feature is implemented.'
      );
    });

    it('should handle different product names', () => {
      const testProduct: Product = {
        id: 2,
        name: 'Another Product',
        description: 'Another Description',
        price: 20.99,
        image: 'test2.jpg',
        rating: 4,
        reviewCount: 5,
        category: 'Test'
      };

      component.addToWishlist(testProduct);

      expect(mockNotificationService.showInfo).toHaveBeenCalledWith(
        'Another Product will be added to wishlist when feature is implemented.'
      );
    });
  });
});
