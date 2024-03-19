import { TestBed } from '@angular/core/testing';

import { ResponsiblePersonsService } from './responsible-persons.service';

describe('ResponsiblePersonsService', () => {
  let service: ResponsiblePersonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiblePersonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
