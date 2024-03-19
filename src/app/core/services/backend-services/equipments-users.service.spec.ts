import { TestBed } from '@angular/core/testing';

import { EquipmentsUsersService } from './equipments-users.service';

describe('EquipmentsUsersService', () => {
  let service: EquipmentsUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentsUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
