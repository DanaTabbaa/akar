import { TestBed } from '@angular/core/testing';

import { RealestatesUsersService } from './realestates-users.service';

describe('RealestatesUsersService', () => {
  let service: RealestatesUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealestatesUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
