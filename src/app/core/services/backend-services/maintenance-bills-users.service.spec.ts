import { TestBed } from '@angular/core/testing';
import { MaintenanceBillsUsersService } from './maintenance-bills-users.service';


describe('MaintenanceBillsUsersService', () => {
  let service: MaintenanceBillsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceBillsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
