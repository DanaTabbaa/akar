import { TestBed } from '@angular/core/testing';
import { SalesBuyContractsSettingsDetailsService } from './sales-buy-contracts-Settings-details.service';


describe('SalesBuyContractsSettingsDetailsService', () => {
  let service: SalesBuyContractsSettingsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesBuyContractsSettingsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
