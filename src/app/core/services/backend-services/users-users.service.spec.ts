import { TestBed } from '@angular/core/testing';
import { UsersUsersService } from './users-users.service';


describe('UsersUsersService', () => {
  let service: UsersUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
