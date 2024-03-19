import { TestBed } from '@angular/core/testing';

import { SaleContractDueService } from './sale-contract-due.service';

describe('SaleContractDueService', () => {
  let service: SaleContractDueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleContractDueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
