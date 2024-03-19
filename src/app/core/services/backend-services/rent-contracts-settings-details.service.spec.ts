import { TestBed } from '@angular/core/testing';

import { RentContractsSettingsDetailsService } from './rent-contracts-settings-details.service';

describe('RentContractsSettingsDetailsService', () => {
  let service: RentContractsSettingsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentContractsSettingsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
