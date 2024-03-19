import { TestBed } from '@angular/core/testing';

import { SaleContractGroundService } from './sale-contract-ground.service';

describe('SaleContractGroundService', () => {
  let service: SaleContractGroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleContractGroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
