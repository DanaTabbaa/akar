import { TestBed } from '@angular/core/testing';

import { DistrictsService } from './district.service';

describe('DistrictsService', () => {
  let service: DistrictsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
