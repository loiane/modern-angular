import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { ProductsService } from '../products.service';
import { FormUtilsService } from './../../shared/form/form-utils.service';
import { Product } from '../product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  images: string[] = [];
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    price: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(500)]),
    image: new FormControl('', [Validators.required]),
    status: new FormControl(''),
    discounted: new FormControl(''),
    discount: new FormControl(0)
  });


  constructor(private formBuilder: NonNullableFormBuilder,
    private productsService: ProductsService,
    public formUtils: FormUtilsService) {
    for (let num = 1; num <= 14; num++) {
      this.images.push(`${num}`);
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      this.productsService.create(this.form.value as Product).subscribe();
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
