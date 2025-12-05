import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card';
import { Product } from '../product';

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
      imports: [ProductCardComponent]
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

  it('should display correct star ratings for 4.5 rating', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const starIcons = compiled.querySelectorAll('mat-icon.star-icon');

    expect(starIcons.length).toBe(5);
    expect(starIcons[0].textContent?.trim()).toBe('star');
    expect(starIcons[1].textContent?.trim()).toBe('star');
    expect(starIcons[2].textContent?.trim()).toBe('star');
    expect(starIcons[3].textContent?.trim()).toBe('star');
    expect(starIcons[4].textContent?.trim()).toBe('star_half');
  });

  it('should display star ratings without half star for whole numbers', () => {
    const productWithWholeRating: Product = {
      ...mockProduct,
      rating: 4
    };

    fixture.componentRef.setInput('product', productWithWholeRating);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const starIcons = compiled.querySelectorAll('mat-icon.star-icon');

    expect(starIcons.length).toBe(5);
    expect(starIcons[0].textContent?.trim()).toBe('star');
    expect(starIcons[1].textContent?.trim()).toBe('star');
    expect(starIcons[2].textContent?.trim()).toBe('star');
    expect(starIcons[3].textContent?.trim()).toBe('star');
    expect(starIcons[4].textContent?.trim()).toBe('star_border');
  });

  it('should display star ratings with empty stars for low ratings', () => {
    const productWithLowRating: Product = {
      ...mockProduct,
      rating: 2
    };

    fixture.componentRef.setInput('product', productWithLowRating);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const starIcons = compiled.querySelectorAll('mat-icon.star-icon');

    expect(starIcons.length).toBe(5);
    expect(starIcons[0].textContent?.trim()).toBe('star');
    expect(starIcons[1].textContent?.trim()).toBe('star');
    expect(starIcons[2].textContent?.trim()).toBe('star_border');
    expect(starIcons[3].textContent?.trim()).toBe('star_border');
    expect(starIcons[4].textContent?.trim()).toBe('star_border');
  });

  it('should emit addToCart event via button click', () => {
    const addToCartSpy = vi.spyOn(component.addToCart, 'emit');

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    const addToCartButton = Array.from(buttons).find(btn => btn.textContent?.includes('Add to Cart')) as HTMLButtonElement;

    expect(addToCartButton).toBeTruthy();

    addToCartButton.click();
    fixture.detectChanges();

    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit addToWishlist event via button click', () => {
    const addToWishlistSpy = vi.spyOn(component.addToWishlist, 'emit');

    const compiled = fixture.nativeElement as HTMLElement;
    const wishlistButton = compiled.querySelector('mat-card-actions button[aria-label="Add to wishlist"]') as HTMLButtonElement;

    expect(wishlistButton).toBeTruthy();

    wishlistButton.click();

    expect(addToWishlistSpy).toHaveBeenCalledWith(mockProduct);
  });

  it('should display sale chip when product is on sale', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardHeader = compiled.querySelector('.card-header');
    const saleChip = cardHeader?.querySelector('mat-chip');

    expect(saleChip).toBeTruthy();
    expect(saleChip?.textContent?.trim()).toBe('Sale');
  });

  it('should not display sale chip when product is not on sale', () => {
    const productNotOnSale: Product = {
      ...mockProduct,
      isOnSale: false
    };

    fixture.componentRef.setInput('product', productNotOnSale);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cardHeader = compiled.querySelector('.card-header');
    const saleChip = cardHeader?.querySelector('mat-chip');

    expect(saleChip).toBeNull();
  });
});
