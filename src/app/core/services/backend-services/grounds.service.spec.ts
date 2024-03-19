import { TestBed } from '@angular/core/testing';

import { GroundsService } from './grounds.service';

describe('GroundsService', () => {
  let service: GroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
