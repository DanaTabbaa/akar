import { TestBed } from '@angular/core/testing';

import { OwnersUsersService } from './owners-users.service';

describe('OwnersUsersService', () => {
  let service: OwnersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
