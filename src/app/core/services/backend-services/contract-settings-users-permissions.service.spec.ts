import { TestBed } from '@angular/core/testing';
import { ContractSettingsUsersPermissionsService } from './contract-settings-users-permissions.service';

describe('ContractSettingsUsersPermissionsService', () => {
  let service: ContractSettingsUsersPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractSettingsUsersPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
