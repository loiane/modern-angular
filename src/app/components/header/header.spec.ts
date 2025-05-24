import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection(),provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    fixture.componentRef.setInput('appTitle', 'Test App');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.branding')?.textContent).toContain('Test App');
  });

  it('should render home button with coffee icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const homeButton = compiled.querySelector('button[routerLink="/"]');
    expect(homeButton).toBeTruthy();
    expect(homeButton?.querySelector('mat-icon')?.textContent).toContain('local_cafe');
  });

  it('should render cart button with shopping cart icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cartButton = compiled.querySelector('button[routerLink="/cart"]');
    expect(cartButton).toBeTruthy();
    expect(cartButton?.querySelector('mat-icon')?.textContent).toContain('shopping_cart');
  });

  it('should have required input appTitle', () => {
    expect(component.appTitle).toBeDefined();
    expect(component.appTitle()).toBe('Test App');
  });
});
