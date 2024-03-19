import { TestBed } from '@angular/core/testing';
import { TechniciansMaintenanceServicesService } from './technicians-maintenance-services.service';


describe('TechniciansMaintenanceServicesService', () => {
  let service: TechniciansMaintenanceServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechniciansMaintenanceServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
