import { TestBed } from '@angular/core/testing';

import { RealestatesService } from './realestates.service';

describe('RealestatesService', () => {
  let service: RealestatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealestatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
