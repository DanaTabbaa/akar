import { TestBed } from '@angular/core/testing';

import { PartnersUsersService } from './partners-users.service';

describe('PartnersUsersService', () => {
  let service: PartnersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
