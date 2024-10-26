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
import { ActivatedRoute } from '@angular/router';

import { Product } from '../product';
import { ProductsService } from '../products.service';
import { FormUtilsService } from './../../shared/form/form-utils.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
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
],
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
  private readonly snackBar = inject(MatSnackBar);
  private readonly location = inject(Location);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.generateImages();

    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productsService.getById(productId).subscribe((product) => {
        if (product) {
          this.form.patchValue(product);
        }
      });
    }
  }

  private generateImages() {
    for (let num = 1; num <= 14; num++) {
      this.images.push(`${num}`);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const product = this.form.value as Product;

      if (product.id) {
        this.productsService.update(product).subscribe({
          next: () => this.onSuccess('Product updated successfully!'),
          error: () => this.onError(),
        });
      } else {
        this.productsService.create(product).subscribe({
          next: () => this.onSuccess('Product created successfully!'),
          error: () => this.onError(),
        });
      }
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  private onSuccess(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
    this.form.reset();
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Error saving product.', '', { duration: 10000 });
  }

  onCancel() {
    this.location.back();
  }
}
