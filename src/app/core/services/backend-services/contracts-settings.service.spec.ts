import { TestBed } from '@angular/core/testing';

import { ContractsSettingsService } from './contracts-settings.service';

describe('ContractsSettingsService', () => {
  let service: ContractsSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractsSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
