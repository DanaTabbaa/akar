import { TestBed } from '@angular/core/testing';

import { RentContractGroundsService } from './rent-contract-grounds.service';

describe('RentContractGroundsService', () => {
  let service: RentContractGroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractGroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
