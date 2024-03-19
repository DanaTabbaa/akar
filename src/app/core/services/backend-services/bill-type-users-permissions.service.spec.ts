import { TestBed } from '@angular/core/testing';
import { BillTypeUsersPermissionsService } from './bill-type-users-permissions.service';

describe('BillTypeUsersPermissionsService', () => {
  let service: BillTypeUsersPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillTypeUsersPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
