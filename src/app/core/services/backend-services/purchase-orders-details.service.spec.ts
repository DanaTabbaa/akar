import { TestBed } from '@angular/core/testing';
import { PurchaseOrdersDetailsService } from './purchase-orders-details.service';


describe('PurchaseOrdersDetailsService', () => {
  let service: PurchaseOrdersDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrdersDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
