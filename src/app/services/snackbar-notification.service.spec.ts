import { TestBed } from '@angular/core/testing';

import { SnackbarNotificationService } from './snackbar-notification.service';

describe('SnackbarNotificationService', () => {
  let service: SnackbarNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
