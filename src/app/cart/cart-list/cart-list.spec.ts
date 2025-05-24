import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartListComponent } from './cart-list';
import { CartService } from '../cart.service';
import { Product } from '../../products/product';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let cartService: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: 'test-image.jpg',
    rating: 4.5,
    reviewCount: 10,
    category: 'test'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListComponent],
      providers: [CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty cart message when no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-cart')).toBeTruthy();
    expect(compiled.textContent).toContain('Your cart is empty');
  });

  it('should display cart items when items exist', () => {
    cartService.addToCart(mockProduct, 2);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-item')).toBeTruthy();
    expect(compiled.textContent).toContain('Test Product');
  });  it('should update quantity when input changes', () => {
    cartService.addToCart(mockProduct, 1);
    jest.spyOn(cartService, 'updateQuantity');
    
    component.updateQuantity(1, '3');
    
    expect(cartService.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should remove item when remove button is clicked', () => {
    cartService.addToCart(mockProduct, 1);
    jest.spyOn(cartService, 'removeFromCart');
    
    component.removeItem(1);
    
    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });
});
