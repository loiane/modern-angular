import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CartItem } from '../../../cart/cart-item';
import { CartService } from '../../cart-service';

@Component({
  selector: 'app-dialog-component',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dialog-component.scss',
})
export class DialogComponent {
  private readonly cartService = inject(CartService);
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<CartItem>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.cartService.removeToCart(this.data.product);
  }
}
