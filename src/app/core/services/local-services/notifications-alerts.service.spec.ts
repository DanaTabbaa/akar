import { TestBed } from '@angular/core/testing';

import { NotificationsAlertsService } from './notifications-alerts.service';

describe('NotificationsAlertsService', () => {
  let service: NotificationsAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
