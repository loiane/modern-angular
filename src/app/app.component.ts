import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    `
})
export class AppComponent {
  title = 'angular-shop';
}
