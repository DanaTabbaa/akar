import { TestBed } from '@angular/core/testing';
import { MaintenanceOffersUsersService } from './maintenance-offers-users.service';


describe('MaintenanceOffersUsersService', () => {
  let service: MaintenanceOffersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceOffersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
