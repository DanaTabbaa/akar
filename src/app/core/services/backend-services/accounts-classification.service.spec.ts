import { TestBed } from '@angular/core/testing';

import { AccountsClassificationService } from './accounts-classification.service';

describe('AccountsClassificationService', () => {
  let service: AccountsClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
