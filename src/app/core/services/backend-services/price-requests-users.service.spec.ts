import { TestBed } from '@angular/core/testing';
import { PriceRequestsUsersService } from './price-requests-users.service';


describe('PriceRequestsUsersService', () => {
  let service: PriceRequestsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceRequestsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
