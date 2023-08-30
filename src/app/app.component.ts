import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    styles: [],
    template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    `,
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'angular-shop';
}
