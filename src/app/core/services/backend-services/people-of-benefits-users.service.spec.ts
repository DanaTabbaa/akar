import { TestBed } from '@angular/core/testing';

import { PeopleOfBenefitsUsersService } from './people-of-benefits-users.service';

describe('PeopleOfBenefitsUsersService', () => {
  let service: PeopleOfBenefitsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleOfBenefitsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
