import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartTotalSummaryComponent } from './cart-total-summary';
import { CartService } from '../cart.service';
import { Product } from '../../products/product';

describe('CartTotalSummaryComponent', () => {
  let component: CartTotalSummaryComponent;
  let fixture: ComponentFixture<CartTotalSummaryComponent>;
  let cartService: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100.00,
    image: 'test-image.jpg',
    rating: 4.5,
    reviewCount: 10,
    category: 'test'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartTotalSummaryComponent],
      providers: [CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(CartTotalSummaryComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty summary when no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No items in cart');
  });

  it('should display correct totals when items exist', () => {
    cartService.addToCart(mockProduct, 2);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Items (2)');
    expect(compiled.textContent).toContain('$200.00'); // subtotal
    expect(compiled.textContent).toContain('$20.00'); // tax
    expect(compiled.textContent).toContain('$220.00'); // total
  });  it('should clear cart when clear button is clicked', () => {
    cartService.addToCart(mockProduct, 1);
    jest.spyOn(cartService, 'clearCart');
    
    component.clearCart();
    
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should log checkout message when checkout button is clicked', () => {
    jest.spyOn(console, 'log');
    
    component.proceedToCheckout();
    
    expect(console.log).toHaveBeenCalledWith('Proceeding to checkout...');
  });
});
