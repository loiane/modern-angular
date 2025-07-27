import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);

  handleError(error: any): void {
    console.error('Global error caught:', error);

    // Show user-friendly error message
    const message = this.getErrorMessage(error);
    this.notificationService.showError(message);
  }

  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
