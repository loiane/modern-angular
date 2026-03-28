import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ProductsGrid } from './products/products-grid/products-grid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ProductsGrid],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('modern-angular');
}
