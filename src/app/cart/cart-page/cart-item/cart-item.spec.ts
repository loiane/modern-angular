import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItem } from './cart-item';

describe('CartItem', () => {
  let component: CartItem;
  let fixture: ComponentFixture<CartItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
