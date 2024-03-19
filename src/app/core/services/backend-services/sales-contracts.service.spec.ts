import { TestBed } from '@angular/core/testing';

import { SalesContractsService } from './sales-contracts.service';

describe('SalesContractsService', () => {
  let service: SalesContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesContractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
