import { TestBed } from '@angular/core/testing';

import { TenantsUsersService } from './tenants-users.service';

describe('TenantsUsersService', () => {
  let service: TenantsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
