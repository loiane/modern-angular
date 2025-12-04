import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsGrid } from './products-grid';
import { ProductList } from '../product-list/product-list';
import { provideHttpClient } from '@angular/common/http';

describe('ProductsGrid', () => {
  let component: ProductsGrid;
  let fixture: ComponentFixture<ProductsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGrid, ProductList],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render products grid wrapper', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const wrapper = compiled.querySelector('.products-grid-wrapper');

    expect(wrapper).toBeTruthy();
  });

  it('should render product list component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productList = compiled.querySelector('app-product-list');

    expect(productList).toBeTruthy();
  });
});
