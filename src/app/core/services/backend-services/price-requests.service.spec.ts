import { TestBed } from '@angular/core/testing';
import { PriceRequestsService } from './price-requests.service';


describe('PriceRequestsService', () => {
  let service: PriceRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
