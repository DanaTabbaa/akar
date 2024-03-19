import { TestBed } from '@angular/core/testing';
import { PriceRequestsDetailsService } from './price-requests-details.service';


describe('PriceRequestsDetailsService', () => {
  let service: PriceRequestsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceRequestsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
