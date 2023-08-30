# Angular Standalone Components Guide

- Official Docs: [https://angular.io/guide/standalone-components](https://angular.io/guide/standalone-components)
- Migrating to standlone: [https://angular.io/guide/standalone-migration](https://angular.io/guide/standalone-migration)

## Migration steps

This schematic is only available Angular 15.2.0 or later.

Run the schematic with the following command:

```
ng generate @angular/core:standalone
```

Run the migration in the order listed below, verifying that your code builds and runs between each step:

- `ng g @angular/core:standalone` and select "Convert all components, directives and pipes to standalone"
- `ng g @angular/core:standalone` and select "Remove unnecessary NgModule classes"
- `ng g @angular/core:standalone` and select "Bootstrap the project using standalone APIs"

### After the migration

- Find and remove any remaining NgModule declarations: since the "Remove unnecessary NgModules" step cannot remove all modules automatically, you may have to remove the remaining declarations manually.

#### Convert routes to standalone

After the migration, the feature modules created will still exist, as they still have the routing configuration. We can also migrate the routing config to standalone, and this step needs to be done manually, it's not supported by the schematic.

##### Cart Routing Module

Before:

```
// cart-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }

```

After:

```
// cart.routes.ts
import { Routes } from '@angular/router';

import { CartComponent } from './cart/cart.component';

export const CART_ROUTES: Routes = [
  { path: '', component: CartComponent }
]
```

##### Products Routing Module

Before:

```
// products-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'new', component: ProductFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
```

After:

```
// products.routes.ts
import { Routes } from '@angular/router';

import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsListComponent } from './products-list/products-list.component';


export const CART_ROUTES: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'new', component: ProductFormComponent }
]
```

##### App Routing Module

Before:

```
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'products'
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

After:

```
// app.routes.ts
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'products'
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.routes').then(m => m.CART_ROUTES)
  }
];
```

Remove app-routing.module from `main.ts`

Before:

```
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
```

After:

```
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES)
  ]
})
```

Now we can safely delete the following files:

- cart-routing.module.ts
- products-routing.module.ts
- app-routing.module.ts

And also delete:

- cart.module.ts
- products.module.ts

#### Lazy loading a standalone component

Any route can lazily load its routed, standalone component by using loadComponent. So instead of creating a CART_ROUTES file, we can lazy load the component directly in the APP_ROUTES and remove the `cart.routes.ts` file:

Before:

```
// app.routes.ts
export const APP_ROUTES: Routes = [
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.routes').then(m => m.CART_ROUTES)
  }
];
```

After:

```
// app.routes.ts
export const APP_ROUTES: Routes = [
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart/cart.component').then(c => c.CartComponent)
  }
];
```

### Inject

Classic DI:

```
constructor(private service: ProductsService, private cartService: CartService) {}
```

After standalone components - new option:

```
private service = inject(ProductsService);
private cartService = inject(CartService);

constructor() {}
```
