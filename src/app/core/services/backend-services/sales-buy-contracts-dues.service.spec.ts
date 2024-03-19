import { TestBed } from '@angular/core/testing';
import { SalesBuyContractDuesService } from './sales-buy-contracts-dues.service';


describe('SalesBuyContractDuesService', () => {
  let service: SalesBuyContractDuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesBuyContractDuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
