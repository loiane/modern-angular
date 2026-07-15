import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products/products-grid/products-grid').then((m) => m!.ProductsGrid),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products-grid/products-grid').then((m) => m!.ProductsGrid),
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart-page/cart-page').then((m) => m!.CartPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./products/products-grid/products-grid').then((m) => m!.ProductsGrid),
  },
];
