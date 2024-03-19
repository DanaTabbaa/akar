import { TestBed } from '@angular/core/testing';

import { NotificationsLogsService } from './notifications-logs.service';

describe('NotificationsLogsService', () => {
  let service: NotificationsLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
