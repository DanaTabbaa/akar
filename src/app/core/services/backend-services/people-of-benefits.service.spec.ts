import { TestBed } from '@angular/core/testing';

import { PeopleOfBenefitsService } from './people-of-benefits.service';

describe('PeopleOfBenefitsService', () => {
  let service: PeopleOfBenefitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleOfBenefitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
