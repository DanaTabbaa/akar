import { TestBed } from '@angular/core/testing';

import { PurchasersUsersService } from './purchasers-users.service';

describe('PurchasersUsersService', () => {
  let service: PurchasersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
