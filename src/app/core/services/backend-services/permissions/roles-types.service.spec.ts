import { TestBed } from '@angular/core/testing';

import { RolesTypesService } from './roles-types.service';

describe('RolesTypesService', () => {
  let service: RolesTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
