import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error-handler.service';
import { NotificationService } from './notification.service';

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;
  let mockNotificationService: any;

  beforeEach(() => {
    const notificationSpy = {
      showError: vi.fn(),
      showSuccess: vi.fn(),
      showInfo: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(GlobalErrorHandler);
    mockNotificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log error to console and show notification', () => {
      const error = new Error('Test error');

      service.handleError(error);

      expect(console.error).toHaveBeenCalledWith('Global error caught:', error);
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Test error');
    });

    it('should handle error with nested error message', () => {
      const error = {
        error: {
          message: 'Nested error message'
        }
      };

      service.handleError(error);

      expect(mockNotificationService.showError).toHaveBeenCalledWith('Nested error message');
    });

    it('should handle string error', () => {
      const error = 'String error message';

      service.handleError(error);

      expect(mockNotificationService.showError).toHaveBeenCalledWith('String error message');
    });

    it('should handle unknown error types with default message', () => {
      const error = { unknownProperty: 'value' };

      service.handleError(error);

      expect(mockNotificationService.showError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });

    it('should handle null/undefined errors', () => {
      service.handleError(null);

      expect(mockNotificationService.showError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from error.error.message', () => {
      const error = {
        error: {
          message: 'API error message'
        }
      };

      const result = (service as any).getErrorMessage(error);

      expect(result).toBe('API error message');
    });

    it('should extract message from error.message', () => {
      const error = {
        message: 'Direct error message'
      };

      const result = (service as any).getErrorMessage(error);

      expect(result).toBe('Direct error message');
    });

    it('should return string error as is', () => {
      const error = 'Simple string error';

      const result = (service as any).getErrorMessage(error);

      expect(result).toBe('Simple string error');
    });

    it('should return default message for unknown error types', () => {
      const error = { randomProperty: 123 };

      const result = (service as any).getErrorMessage(error);

      expect(result).toBe('An unexpected error occurred. Please try again.');
    });
  });
});
