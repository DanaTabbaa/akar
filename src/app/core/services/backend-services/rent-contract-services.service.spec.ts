import { TestBed } from '@angular/core/testing';

import { RentContractServicesService } from './rent-contract-services.service';

describe('RentContractServicesService', () => {
  let service: RentContractServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
