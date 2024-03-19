import { TestBed } from '@angular/core/testing';

import { CompaniesActivitiesService } from './companies-activities.service';

describe('CompaniesActivitiesService', () => {
  let service: CompaniesActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
