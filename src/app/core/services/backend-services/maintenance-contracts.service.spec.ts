import { TestBed } from '@angular/core/testing';
import { MaintenanceContractsService } from './maintenance-contracts.service';


describe('MaintenanceContractsService', () => {
  let service: MaintenanceContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceContractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
