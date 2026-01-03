import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CartButton } from '../../cart/cart-button/cart-button';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, MatIconModule, CartButton],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly appTitle = input.required<string>();
}
