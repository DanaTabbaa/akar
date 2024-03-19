import { TestBed } from '@angular/core/testing';

import { SalesContractUnitService } from './sales-contract-unit.service';

describe('SalesContractUnitService', () => {
  let service: SalesContractUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesContractUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
