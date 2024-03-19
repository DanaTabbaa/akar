import { TestBed } from '@angular/core/testing';

import { RentContractUsersService } from './rent-contract-users.service';

describe('RentContractUsersService', () => {
  let service: RentContractUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
