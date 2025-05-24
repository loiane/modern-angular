import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product-service';
import { Product } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      description: 'Test description 1',
      price: 99.99,
      image: 'test1.jpg',
      rating: 4.5,
      reviewCount: 10,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Test Product 2',
      description: 'Test description 2',
      price: 49.99,
      originalPrice: 59.99,
      image: 'test2.jpg',
      rating: 4.0,
      reviewCount: 5,
      category: 'Clothing',
      isOnSale: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have productsResource property', () => {
    expect(service.productsResource).toBeDefined();
  });

  it('should return products resource from getProducts method', () => {
    const productsResource = service.getProducts();
    expect(productsResource).toBeDefined();
    expect(productsResource).toBe(service.productsResource);
  });

  it('should have httpResource with correct initial state', () => {
    const resource = service.productsResource;
    expect(resource.value()).toBeUndefined();
    expect(resource.isLoading()).toBe(true); // httpResource starts loading immediately
    expect(resource.error()).toBeUndefined();
  });

  it('should have reload method available on httpResource', () => {
    const resource = service.productsResource;
    expect(typeof resource.reload).toBe('function');
  });
});
