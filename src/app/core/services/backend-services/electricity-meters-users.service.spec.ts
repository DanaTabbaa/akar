import { TestBed } from '@angular/core/testing';

import { ElectricityMetersUsersService } from './electricity-meters-users.service';

describe('ElectricityMetersUsersService', () => {
  let service: ElectricityMetersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricityMetersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
