import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // HTTP resource for products that loads from JSON file
  productsResource = httpResource<Product[]>(() => ({
    url: '/api/products.json'
  }));

  getProducts() {
    return this.productsResource;
  }
}
