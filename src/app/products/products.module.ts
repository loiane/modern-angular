import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';

import { ProductFormComponent } from './product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    ProductsListComponent,
    ProductFormComponent
]
})
export class ProductsModule { }
