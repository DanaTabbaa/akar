import { TestBed } from '@angular/core/testing';
import { SalesBuyContractUnitsService } from './sales-buy-contracts-units.service';


describe('SalesBuyContractUnitsService', () => {
  let service: SalesBuyContractUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesBuyContractUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
