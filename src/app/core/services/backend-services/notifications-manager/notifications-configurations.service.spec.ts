import { TestBed } from '@angular/core/testing';

import { NotificationsConfigurationsService } from './notifications-configurations.service';

describe('NotificationsConfigurationsService', () => {
  let service: NotificationsConfigurationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsConfigurationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
