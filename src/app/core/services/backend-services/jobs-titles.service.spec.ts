import { TestBed } from '@angular/core/testing';

import { JobsTitlesService } from './jobs-titles.service';

describe('JobsTitlesService', () => {
  let service: JobsTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsTitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
