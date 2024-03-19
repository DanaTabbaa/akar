import { TestBed } from '@angular/core/testing';

import { RegionsUsersService } from './regions-users.service';

describe('RegionsUsersService', () => {
  let service: RegionsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
