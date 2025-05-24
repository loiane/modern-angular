import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card';
import { Product } from '../product';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    originalPrice: 129.99,
    image: 'test-image.jpg',
    rating: 4.5,
    reviewCount: 100,
    category: 'Test Category',
    isOnSale: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product information', () => {
    expect(component.product()).toEqual(mockProduct);
  });

  it('should generate correct star ratings', () => {
    const stars = component.getStars(4.5);
    expect(stars).toEqual(['star', 'star', 'star', 'star', 'star_half']);
  });

  it('should emit addToCart event', () => {
    const addToCartSpy = jest.spyOn(component.addToCart, 'emit');
    component.onAddToCart();
    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit addToWishlist event', () => {
    const addToWishlistSpy = jest.spyOn(component.addToWishlist, 'emit');
    component.onAddToWishlist();
    expect(addToWishlistSpy).toHaveBeenCalledWith(mockProduct);
  });
});
