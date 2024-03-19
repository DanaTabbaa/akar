import { TestBed } from '@angular/core/testing';

import { RentContractDuesService } from './rent-contract-dues.service';

describe('RentContractDuesService', () => {
  let service: RentContractDuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractDuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
