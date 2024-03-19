import { TestBed } from '@angular/core/testing';

import { CompanyInfoUsersService } from './company-info-users.service';

describe('CompanyInfoUsersService', () => {
  let service: CompanyInfoUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyInfoUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
