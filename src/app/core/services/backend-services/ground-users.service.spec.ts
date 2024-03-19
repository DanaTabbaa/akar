import { TestBed } from '@angular/core/testing';

import { GroundUsersService } from './ground-users.service';

describe('GroundUsersService', () => {
  let service: GroundUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroundUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
