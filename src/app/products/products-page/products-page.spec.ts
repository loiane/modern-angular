import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
