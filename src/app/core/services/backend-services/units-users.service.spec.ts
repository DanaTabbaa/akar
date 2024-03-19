import { TestBed } from '@angular/core/testing';

import { UnitsUsersService } from './units-users.service';

describe('UnitsUsersService', () => {
  let service: UnitsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
