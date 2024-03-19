import { TestBed } from '@angular/core/testing';
import { MaintenancePurchaseBillsService } from './maintenance-purchase-bills.service';


describe('MaintenancePurchaseBillsService', () => {
  let service: MaintenancePurchaseBillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenancePurchaseBillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
