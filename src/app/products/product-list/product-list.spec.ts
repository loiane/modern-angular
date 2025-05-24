import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideAnimationsAsync()]
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

  it('should generate correct star ratings', () => {
    const stars = component.getStars(4.5);
    expect(stars).toEqual(['star', 'star', 'star', 'star', 'star_half']);
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
});
