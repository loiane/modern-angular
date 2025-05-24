import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../product-service';
import { signal } from '@angular/core';
import { Product } from '../product';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockProductService: jest.Mocked<ProductService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      category: 'Electronics',
      image: 'test1.jpg',
      price: 99.99,
      description: 'Test description 1',
      rating: 4.5,
      reviewCount: 10
    },
    {
      id: 2,
      name: 'Test Product 2',
      category: 'Clothing',
      image: 'test2.jpg',
      price: 49.99,
      description: 'Test description 2',
      rating: 4.0,
      reviewCount: 5
    }
  ];

  beforeEach(async () => {
    // Create mock ProductService
    const mockResource = {
      value: signal(mockProducts),
      isLoading: signal(false),
      error: signal(undefined),
      reload: jest.fn(),
      request: jest.fn()
    };

    mockProductService = {
      getProducts: jest.fn().mockReturnValue(mockResource),
      productsResource: mockResource
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products', () => {
    expect(component.products().length).toBeGreaterThan(0);
  });

  it('should handle add to cart', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const product = component.products()[0];
    component.addToCart(product);
    expect(consoleSpy).toHaveBeenCalledWith('Added to cart:', product.name);
  });

  it('should handle add to wishlist', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const product = component.products()[0];
    component.addToWishlist(product);
    expect(consoleSpy).toHaveBeenCalledWith('Added to wishlist:', product.name);
  });

  it('should have loading state computed property', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should have error state computed property', () => {
    expect(component.hasError()).toBe(false);
  });

  it('should return correct product list from computed signal', () => {
    expect(component.products()).toEqual(mockProducts);
    expect(component.products().length).toBe(2);
  });

  it('should handle loading state', () => {
    // Create a new mock with loading state
    const loadingResource = {
      value: signal(null),
      isLoading: signal(true),
      error: signal(undefined),
      reload: jest.fn(),
      request: jest.fn()
    };

    mockProductService.getProducts.mockReturnValue(loadingResource);

    // Create a new component instance
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService }
      ]
    });

    const newFixture = TestBed.createComponent(ProductList);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.isLoading()).toBe(true);
    expect(newComponent.products()).toEqual([]);
  });

  it('should handle error state', () => {
    // Create a new mock with error state
    const errorResource = {
      value: signal(null),
      isLoading: signal(false),
      error: signal(new Error('Network error')),
      reload: jest.fn(),
      request: jest.fn()
    };

    mockProductService.getProducts.mockReturnValue(errorResource);

    // Create a new component instance
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService }
      ]
    });

    const newFixture = TestBed.createComponent(ProductList);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.hasError()).toBe(true);
    expect(newComponent.products()).toEqual([]);
  });
});
