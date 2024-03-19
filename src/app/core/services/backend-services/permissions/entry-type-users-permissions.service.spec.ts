import { TestBed } from '@angular/core/testing';

import { EntryTypeUsersPermissionsService } from './entry-type-users-permissions.service';

describe('EntryTypeUsersPermissionsService', () => {
  let service: EntryTypeUsersPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryTypeUsersPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
