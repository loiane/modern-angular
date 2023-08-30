# Angular Signals Guide

- Official Docs: [https://angular.io/guide/signals](https://angular.io/guide/signals)

In this project, we're using Observables to notify components of any changes done to the cart.
We can replace Observables in this particular scenario with Signals, given the CartService properties are computed properties.

## Creating a Writable Signal

For example, we're handling the items in the cart in an private property, and we also have an Observable so we can use RxJS to notify in case there are changes made to this array:

```
private cartItems: CartItem[] = [];
private cartItems$ = new BehaviorSubject<CartItem[]>(this.cartItems);
```

We can simplify this code by making `cartItems` as a Signal and also making a public property:

```
cartItems = signal<CartItem[]>([]);
```

## Obtaining the value of a Signal

Next, we'll start getting some compilation errors because `cartItems` is no longer an array. We can fix it, by using the getter function:

```
 private cartItems$ = new BehaviorSubject<CartItem[]>(this.cartItems());
```

To retrieve the value of a signal, we simply add () to the signal to access it getter function: `cartItems()`.

## Setting the value or updating a Signal

To change the value of a writable signal, you can either `set()`` it directly:

```
cartItems.set([])
```

When working with signals that contains objects or are an array, we can use the `mutate()` method to push a new value or modify an existing value:

```
// before
cartItems: CartItem[] = [];
this.cartItems.push({ product, quantity: 1 });

//after
this.cartItems.mutate((items) => items.push({ product, quantity: 1 }));
```

Or we can also use the `update()`` operation to compute a new value from the previous one:

Before:

```
removeProduct(product: Product): void {
  this.cartItems = this.cartItems().filter((p) => p.product.id !== product.id);
}
```

After:

```
removeProduct(product: Product): void {
  this.cartItems.update((items) => items.filter((p) => p.product.id !== product.id));
}
```

## Replacing an Observable with a Signal

Once we convert an Observable to a Signal, we also need to apply some changes to our templates.

Before:

```
cartItems$: Observable<CartItem[]> = this.cartService.getCartItems();;
```

After:

```
cartItems = this.cartService.cartItems;
```

HTML Before:

```
<div *ngFor="let cartItem of cartItems$ | async">
  <app-cart-item [cartItem]="cartItem"></app-cart-item>
</div>
```

HTML After:

```
<div *ngFor="let cartItem of cartItems()">
  <app-cart-item [cartItem]="cartItem"></app-cart-item>
</div>
```

## Creating a Computed Signal

A computed signal is a signal that depends on other signal(s) in order to compute its own value.
For example, to count how many items we have in the cart, we need to iterate the cart items array and check how many of each item the user added to cart before we have the total. Up until now, we depended on RxJS operators to be able to provide a value, and signals are perfect for these cases.

Before with RxJS:

```
cartCount$ = this.cartItems$.pipe(
    // calculate total quantity
    map((items: CartItem[]) => {
      return items.reduce((acc, curr) => acc + curr.quantity, 0);
    })
  );
```

After with Signals:

```
cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));
```

So whenever there is a change in the cartItems, the cartCount will be updated automatically as well.

We can still use alias variables in Angular templates to make it easier to reference the value within the HTML:

```
<span class="notification-label" *ngIf="cartCount() as count">{{
  count > 0 ? count : ""
}}</span>
```

Let's see how we can simply the cart totals with Signals instead of Observables:

Before:

```
cartSubTotal$ = this.cartItems$.pipe(
  map((items: CartItem[]) =>
    items.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0))
);

cartTax$ = this.cartSubTotal$.pipe(
  // calculate tax of 8% on top of the subtotal
  map((subTotal) => subTotal * 0.08)
);

cartTotal$ = combineLatest([
  this.cartSubTotal$,
  this.cartTax$
]).pipe(map(([subTotal, tax]) => subTotal + tax));
```

After:

```
cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));

cartTax = computed(() => this.cartSubTotal() * 0.08);

cartTotal = computed(() => this.cartSubTotal() + this.cartTax());
```
