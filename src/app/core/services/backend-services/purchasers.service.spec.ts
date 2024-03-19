import { TestBed } from '@angular/core/testing';

import { PurchasersService } from './purchasers.service';

describe('PurchasersService', () => {
  let service: PurchasersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
