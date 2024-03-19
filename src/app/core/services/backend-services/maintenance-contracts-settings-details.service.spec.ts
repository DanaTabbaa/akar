import { TestBed } from '@angular/core/testing';
import { MaintenanceContractsSettingsDetailsService } from './maintenance-contracts-Settings-details.service';


describe('MaintenanceContractsSettingsDetailsService', () => {
  let service: MaintenanceContractsSettingsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceContractsSettingsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
