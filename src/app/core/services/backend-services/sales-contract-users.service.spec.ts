import { TestBed } from '@angular/core/testing';

import { SalesContractUsersService } from './sales-contract-users.service';

describe('SalesContractUsersService', () => {
  let service: SalesContractUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesContractUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
