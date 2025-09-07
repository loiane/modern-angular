import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full'  },
  {
    path: 'products',
    loadComponent: () => import('./products/products-page/products-page').then(m => m.ProductsPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart').then(m => m.CartComponent)
  }
];
