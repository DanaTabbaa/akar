import { TestBed } from '@angular/core/testing';
import { MaintenanceBillsService } from './maintenance-bills.service';


describe('MaintenanceBillsService', () => {
  let service: MaintenanceBillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceBillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
