import { TestBed } from '@angular/core/testing';

import { RentContractsService } from './rent-contracts.service';

describe('RentContractsService', () => {
  let service: RentContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
