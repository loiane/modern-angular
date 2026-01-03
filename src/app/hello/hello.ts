import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hello',
  imports: [],
  templateUrl: './hello.html',
  styleUrl: './hello.scss',
})
export class Hello {

  protected title = 'Welcome to Modern Angular!';

  protected isDisabled = false;

  protected onClick() {
    console.log('Button clicked');
    this.isDisabled = !this.isDisabled;
  }

  protected count = signal(0);

  increateCounter() {
   // same as: count = count + 1;
   this.count.update(value => value + 1);
  }

  decreaseCounter() {
    this.count.update(value => value - 1);
  }

  resetCounter() {
    this.count.set(0);
  }
}
