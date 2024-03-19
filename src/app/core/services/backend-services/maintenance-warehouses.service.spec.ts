import { TestBed } from '@angular/core/testing';

import { MaintenanceWarehousesService } from './maintenance-warehouses.service';

describe('MaintenanceWarehousesService', () => {
  let service: MaintenanceWarehousesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceWarehousesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
