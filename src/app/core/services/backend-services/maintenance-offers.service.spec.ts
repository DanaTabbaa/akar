import { TestBed } from '@angular/core/testing';
import { MaintenanceOffersService } from './maintenance-offers.service';


describe('MaintenanceOffersService', () => {
  let service: MaintenanceOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
