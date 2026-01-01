import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hello } from './hello';

describe('Hello', () => {
  let component: Hello;
  let fixture: ComponentFixture<Hello>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hello]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hello);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
