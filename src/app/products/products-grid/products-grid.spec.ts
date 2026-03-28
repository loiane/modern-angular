import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGrid } from './products-grid';

describe('ProductsGrid', () => {
  let component: ProductsGrid;
  let fixture: ComponentFixture<ProductsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
