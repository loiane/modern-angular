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
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('app-product-card');

    expect(productCards.length).toBe(2);
  });

  it('should render product grid with product cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productGrid = compiled.querySelector('.product-grid');
    const productCards = compiled.querySelectorAll('app-product-card');

    expect(productGrid).toBeTruthy();
    expect(productCards.length).toBe(2);
  });

  it('should handle addToCart event from product card', () => {
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
    const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;

    // Emit the addToCart event
    firstCardComponent.addToCart.emit(firstCardComponent.product());

    expect(mockCartService.addToCart).toHaveBeenCalledWith(firstCardComponent.product(), 1);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Test Product 1 added to cart!');
  });

  it('should handle addToCart event emission from product-card template', () => {
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
    const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;

    // Trigger the addToCart output event from the child component
    firstCardComponent.addToCart.emit(firstCardComponent.product());
    fixture.detectChanges();

    expect(mockCartService.addToCart).toHaveBeenCalled();
  });

  it('should not show loading spinner when data is loaded', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');

    expect(spinner).toBeNull();
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
    emptyFixture.detectChanges();

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

    const errorFixture = TestBed.createComponent(ProductList);
    errorFixture.detectChanges();

    const compiled = errorFixture.nativeElement as HTMLElement;
    const errorContainer = compiled.querySelector('.error-container');
    const errorIcon = compiled.querySelector('.error-icon');
    const heading = compiled.querySelector('h3');
    const errorText = compiled.querySelector('p');

    expect(errorContainer).toBeTruthy();
    expect(errorIcon?.textContent?.trim()).toBe('error_outline');
    expect(heading?.textContent?.trim()).toBe('Oops! Something went wrong');
    expect(errorText?.textContent?.trim()).toContain('Failed to load products');
  });

  it('should show loading spinner when products are loading', () => {
    const loadingResource = {
      value: signal(null),
      isLoading: signal(true),
      error: signal(undefined),
      headers: signal(undefined),
      statusCode: signal(200),
      progress: signal(null),
      hasValue: signal(false),
      reload: vi.fn(),
      request: vi.fn(),
      destroy: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      asReadonly: vi.fn(),
      status: signal('loading' as any)
    };

    mockProductService.getProducts.mockReturnValue(loadingResource as any);

    const loadingFixture = TestBed.createComponent(ProductList);
    loadingFixture.detectChanges();

    const compiled = loadingFixture.nativeElement as HTMLElement;
    const loadingContainer = compiled.querySelector('.loading-container');
    const spinner = compiled.querySelector('mat-spinner');
    const loadingText = compiled.querySelector('p');

    expect(loadingContainer).toBeTruthy();
    expect(spinner).toBeTruthy();
    expect(loadingText?.textContent?.trim()).toBe('Loading products...');
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
    it('should add product to cart successfully via product card interaction', () => {
      mockCartService.addToCart.mockReturnValue({ success: true, message: 'Item added successfully' });

      const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
      const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;

      // Trigger the addToCart event as if the user clicked the button in the template
      firstCardComponent.addToCart.emit(firstCardComponent.product());
      fixture.detectChanges();

      expect(mockCartService.addToCart).toHaveBeenCalledWith(firstCardComponent.product(), 1);
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    });

    it('should handle cart addition failure and show error notification', () => {
      const errorMessage = 'Cart is full';
      mockCartService.addToCart.mockReturnValue({ success: false, message: errorMessage });

      const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
      const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;

      firstCardComponent.addToCart.emit(firstCardComponent.product());
      fixture.detectChanges();

      expect(mockCartService.addToCart).toHaveBeenCalled();
      expect(mockNotificationService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('addToWishlist', () => {
    it('should show info notification when adding to wishlist', () => {
      const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(ProductCardComponent));
      const firstCardComponent = debugElements[0].componentInstance as ProductCardComponent;

      firstCardComponent.addToWishlist.emit(firstCardComponent.product());
      fixture.detectChanges();

      expect(mockNotificationService.showInfo).toHaveBeenCalledWith(
        expect.stringContaining('will be added to wishlist when feature is implemented')
      );
    });
  });
});
