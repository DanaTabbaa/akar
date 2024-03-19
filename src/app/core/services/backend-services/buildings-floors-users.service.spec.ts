import { TestBed } from '@angular/core/testing';

import { BuildingFloorUserService } from './buildings-floors-users.service';

describe('BuildingFloorUserService', () => {
  let service: BuildingFloorUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingFloorUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
