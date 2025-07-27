import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
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
        horizontalPosition: 'end',
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
        horizontalPosition: 'end',
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
        horizontalPosition: 'end',
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
        horizontalPosition: 'end',
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
        horizontalPosition: 'end',
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
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  });
});
