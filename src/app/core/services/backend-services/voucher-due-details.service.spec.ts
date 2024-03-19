import { TestBed } from '@angular/core/testing';
import { VoucherDueDetailsService } from './voucher-due-details.service';

describe('VoucherDueDetailsService', () => {
  let service: VoucherDueDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherDueDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
