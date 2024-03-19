import { TestBed } from '@angular/core/testing';

import { AccountsTypesService } from './accounts-types.service';

describe('AccountsTypesService', () => {
  let service: AccountsTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
