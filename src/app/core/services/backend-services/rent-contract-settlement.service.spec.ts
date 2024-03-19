import { TestBed } from '@angular/core/testing';

import { RentContractSettlementService } from './rent-contract-settlement.service';

describe('RentContractSettlementService', () => {
  let service: RentContractSettlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractSettlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
