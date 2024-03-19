import { TestBed } from '@angular/core/testing';
import { MaintenanceContractsDetailsService } from './maintenance-contracts-details.service';


describe('MaintenanceContractsDetailsService', () => {
  let service: MaintenanceContractsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceContractsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
