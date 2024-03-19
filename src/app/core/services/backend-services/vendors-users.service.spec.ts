import { TestBed } from '@angular/core/testing';

import { VendorsUsersService } from './vendors-users.service';

describe('VendorsUsersService', () => {
  let service: VendorsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
