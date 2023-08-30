import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product } from '../product';
import { ProductsService } from '../products.service';
import { FormUtilsService } from './../../shared/form/form-utils.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

  images: string[] = [];
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    price: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(500)]),
    image: new FormControl('', [Validators.required]),
    status: new FormControl(''),
    discounted: new FormControl('', [Validators.max(400)]),
    discount: new FormControl(0)
  });


  constructor(private formBuilder: NonNullableFormBuilder,
    private snackBar: MatSnackBar,
    private location: Location,
    private productsService: ProductsService,
    public formUtils: FormUtilsService) {
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
        error: () => this.onError()
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
