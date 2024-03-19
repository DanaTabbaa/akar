import { TestBed } from '@angular/core/testing';
import { MaintenanceContractsUsersService } from './maintenance-contracts-users.service';


describe('MaintenanceContractsUsersService', () => {
  let service: MaintenanceContractsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceContractsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
