import { TestBed } from '@angular/core/testing';
import { VoucherDetailsService } from './voucher-details.service';

describe('VoucherDetailsService', () => {
  let service: VoucherDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
