import { TestBed } from '@angular/core/testing';

import { CitiesUsersService } from './cities-users.service';

describe('CitiesUsersService', () => {
  let service: CitiesUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitiesUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
