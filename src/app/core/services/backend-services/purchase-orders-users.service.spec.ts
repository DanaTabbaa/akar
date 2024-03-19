import { TestBed } from '@angular/core/testing';
import { PurchaseOrdersUsersService } from './purchase-orders-users.service';


describe('PurchaseOrdersUsersService', () => {
  let service: PurchaseOrdersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrdersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
