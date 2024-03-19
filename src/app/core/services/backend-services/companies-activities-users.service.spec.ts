import { TestBed } from '@angular/core/testing';

import { CompaniesActivitiesUsersService } from './companies-activities-users.service';

describe('CompaniesActivitiesUsersService', () => {
  let service: CompaniesActivitiesUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesActivitiesUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
