import { TestBed } from '@angular/core/testing';

import { OfficesUsersService } from './offices-users.service';

describe('OfficesUsersService', () => {
  let service: OfficesUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficesUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
