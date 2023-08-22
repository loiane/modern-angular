import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { AppMaterialModule } from './app-material.module';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule
  ],
  exports: [HeaderComponent]
})
export class SharedModule { }
