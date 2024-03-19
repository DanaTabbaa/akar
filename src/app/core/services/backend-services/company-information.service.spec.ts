import { TestBed } from '@angular/core/testing';

import { CompanyInformationService } from './company-information.service';

describe('CompanyInformationService', () => {
  let service: CompanyInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
