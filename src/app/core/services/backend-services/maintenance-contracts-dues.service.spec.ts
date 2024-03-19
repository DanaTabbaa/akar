import { TestBed } from '@angular/core/testing';
import { MaintenanceContracstDuesService } from './maintenance-contracts-dues.service';
import { MaintenanceContractsSettingsDetailsService } from './maintenance-contracts-Settings-details.service';


describe('MaintenanceContracstDuesService', () => {
  let service: MaintenanceContracstDuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceContracstDuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
