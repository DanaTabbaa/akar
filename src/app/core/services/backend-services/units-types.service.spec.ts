import { TestBed } from '@angular/core/testing';

import { UnitsTypesService } from './units-types.service';

describe('UnitsTypesService', () => {
  let service: UnitsTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitsTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
