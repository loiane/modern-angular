import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartTotalSummaryComponent } from './cart-total-summary.component';

describe('CartTotalSummaryComponent', () => {
  let component: CartTotalSummaryComponent;
  let fixture: ComponentFixture<CartTotalSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CartTotalSummaryComponent]
});
    fixture = TestBed.createComponent(CartTotalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
