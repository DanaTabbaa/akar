import { TestBed } from '@angular/core/testing';

import { UnitServicesService } from './unit-services.service';

describe('UnitServicesService', () => {
  let service: UnitServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
