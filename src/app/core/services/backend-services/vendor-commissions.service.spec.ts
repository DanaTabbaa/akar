import { TestBed } from '@angular/core/testing';

import { VendorCommissionsService } from './vendor-commissions.service';

describe('VendorCommissionsService', () => {
  let service: VendorCommissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorCommissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
