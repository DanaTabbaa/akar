import { TestBed } from '@angular/core/testing';

import { ContractsTypesService } from './contracts-types.service';

describe('ContractsTypesService', () => {
  let service: ContractsTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractsTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
