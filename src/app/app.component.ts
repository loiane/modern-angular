import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';

@Component({
    selector: 'app-root',
    styles: [],
    template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    `,
    imports: [RouterOutlet, HeaderComponent]
})
export class AppComponent {
  title = 'angular-shop';
}
