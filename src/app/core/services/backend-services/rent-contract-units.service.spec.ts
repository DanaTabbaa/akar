import { TestBed } from '@angular/core/testing';

import { RentContractUnitsService } from './rent-contract-units.service';

describe('RentContractUnitsService', () => {
  let service: RentContractUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
