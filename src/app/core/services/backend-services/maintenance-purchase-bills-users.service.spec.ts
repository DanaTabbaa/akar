import { TestBed } from '@angular/core/testing';
import { MaintenancePurchaseBillsUsersService } from './maintenance-purchase-bills-users.service';


describe('MaintenancePurchaseBillsUsersService', () => {
  let service: MaintenancePurchaseBillsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenancePurchaseBillsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
