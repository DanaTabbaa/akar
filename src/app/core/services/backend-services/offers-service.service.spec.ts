import { TestBed } from '@angular/core/testing';

import { OffersService } from './offers-service.service';

describe('OffersServiceService', () => {
  let service: OffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
