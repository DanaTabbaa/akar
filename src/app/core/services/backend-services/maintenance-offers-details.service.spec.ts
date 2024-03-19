import { TestBed } from '@angular/core/testing';
import { MaintenanceOffersDetailsService } from './maintenance-offers-details.service';


describe('MaintenanceOffersDetailsService', () => {
  let service: MaintenanceOffersDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceOffersDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
