import { Component, computed, signal } from '@angular/core';

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

  protected doubleCount = computed(() => this.count() * 2);

  // getDoubleCount() {
  //   console.log('getDoubleCount called');
  //   return this.count() * 2;
  // }

  protected increateCounter() {
   // same as: count = count + 1;
   this.count.update(value => value + 1);
  }

  protected decreaseCounter() {
    this.count.update(value => value - 1);
  }

  protected resetCounter() {
    this.count.set(0);
  }
}
