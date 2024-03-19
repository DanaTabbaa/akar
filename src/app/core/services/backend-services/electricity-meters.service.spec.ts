import { TestBed } from '@angular/core/testing';

import { ElectricityMetersService } from './electricity-meters.service';

describe('ElectricityMetersService', () => {
  let service: ElectricityMetersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricityMetersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
