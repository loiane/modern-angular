import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full'  },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list/product-list').then(m => m.ProductList)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart').then(m => m.CartComponent)
  }
];
