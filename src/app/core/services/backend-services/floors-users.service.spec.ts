import { TestBed } from '@angular/core/testing';

import { FloorsUsersService } from './floors-users.service';

describe('FloorsUsersService', () => {
  let service: FloorsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloorsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
