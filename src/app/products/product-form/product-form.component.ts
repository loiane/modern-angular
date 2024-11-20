import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Product } from '../product';
import { ProductsService } from '../products.service';
import { FormUtilsService } from './../../shared/form/form-utils.service';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    imports: [
        MatCardModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatSnackBarModule
    ]
})
export class ProductFormComponent {
  images: string[] = [];
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    price: new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(500),
    ]),
    image: new FormControl('', [Validators.required]),
    status: new FormControl(''),
    discounted: new FormControl('', [Validators.max(400)]),
    discount: new FormControl(0),
  });

  formUtils = inject(FormUtilsService);
  private snackBar = inject(MatSnackBar);
  private location = inject(Location);
  private productsService = inject(ProductsService);

  constructor() {
    this.generateImages();
  }

  private generateImages() {
    for (let num = 1; num <= 14; num++) {
      this.images.push(`${num}`);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.productsService.create(this.form.value as Product).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError(),
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  private onSuccess() {
    this.snackBar.open('Product saved successfully!', '', { duration: 5000 });
    this.form.reset();
  }

  private onError() {
    this.snackBar.open('Error saving product.', '', { duration: 10000 });
  }

  onCancel() {
    this.location.back();
  }
}
