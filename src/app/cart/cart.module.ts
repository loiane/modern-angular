import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { CartItemComponent } from './cart-item/cart-item.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { CartTotalSummaryComponent } from './cart-total-summary/cart-total-summary.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    CartRoutingModule,
    FormsModule,
    CartComponent,
    CartItemComponent,
    CartListComponent,
    CartTotalSummaryComponent
]
})
export class CartModule { }
