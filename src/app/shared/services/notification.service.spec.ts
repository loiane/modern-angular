import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: any;

  beforeEach(() => {
    const snackBarSpy = {
      open: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess', () => {
    it('should show success notification with default duration', () => {
      const message = 'Success message';

      service.showSuccess(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });

    it('should show success notification with custom duration', () => {
      const message = 'Success message';
      const duration = 5000;

      service.showSuccess(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  });

  describe('showError', () => {
    it('should show error notification with default duration', () => {
      const message = 'Error message';

      service.showError(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });

    it('should show error notification with custom duration', () => {
      const message = 'Error message';
      const duration = 10000;

      service.showError(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 10000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  });

  describe('showInfo', () => {
    it('should show info notification with default duration', () => {
      const message = 'Info message';

      service.showInfo(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });

    it('should show info notification with custom duration', () => {
      const message = 'Info message';
      const duration = 4000;

      service.showInfo(message, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 4000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  });
});
