import { TestBed } from '@angular/core/testing';

import { RentContractsMaintenanceService } from './rent-contracts-mainenance.service';

describe('RentContractsMaintenanceService', () => {
  let service: RentContractsMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractsMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
