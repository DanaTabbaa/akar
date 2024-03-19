import { TestBed } from '@angular/core/testing';

import { WaterMetersUsersService } from './water-meters-users.service';

describe('WaterMetersUsersService', () => {
  let service: WaterMetersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaterMetersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
