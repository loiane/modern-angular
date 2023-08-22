import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {

  products$: Observable<Product[]>;

  constructor(private service: ProductsService) {
    this.products$ = this.service.load();
  }
}
