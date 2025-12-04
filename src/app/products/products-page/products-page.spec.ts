import { ComponentFixture, TestBed, DeferBlockState } from '@angular/core/testing';
import { ProductsPage } from './products-page';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ProductsPage (deferrable)', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeAll(() => {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element): void {
        const rect = target.getBoundingClientRect();
        const entry: IntersectionObserverEntry = {
          isIntersecting: false,
          intersectionRatio: 0,
          target,
          time: Date.now(),
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: null
        } as IntersectionObserverEntry;
        this.callback([entry], this);
      }
      unobserve(_target: Element): void { /* noop */ }
      disconnect(): void { /* noop */ }
      takeRecords(): IntersectionObserverEntry[] { return []; }
    }
    (globalThis as any).IntersectionObserver = MockIntersectionObserver;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder skeleton initially', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-products-skeleton')).toBeTruthy();
  });

  it('should render products-grid when defer block loads', async () => {
    // Get all defer block fixtures
    const deferBlocks = await fixture.getDeferBlocks();

    // Render the defer block in complete state (simulates the viewport trigger)
    await deferBlocks[0].render(DeferBlockState.Complete);

    const compiled = fixture.nativeElement as HTMLElement;
    const productsGrid = compiled.querySelector('app-products-grid');

    expect(productsGrid).toBeTruthy();
  });

  it('should render skeleton in loading state', async () => {
    const deferBlocks = await fixture.getDeferBlocks();

    // Render the defer block in loading state
    await deferBlocks[0].render(DeferBlockState.Loading);

    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('app-products-skeleton');

    expect(skeleton).toBeTruthy();
  });

  it('should render error fallback in error state', async () => {
    const deferBlocks = await fixture.getDeferBlocks();

    // Render the defer block in error state
    await deferBlocks[0].render(DeferBlockState.Error);

    const compiled = fixture.nativeElement as HTMLElement;
    const errorFallback = compiled.querySelector('.error-fallback');
    const errorMessage = errorFallback?.textContent?.trim();

    expect(errorFallback).toBeTruthy();
    expect(errorFallback?.getAttribute('role')).toBe('alert');
    expect(errorMessage).toContain('Failed to load products. Please try again later.');
  });
});
