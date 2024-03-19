import { TestBed } from '@angular/core/testing';
import { TechniciansUsersService } from './technicians-users.service';


describe('TechniciansUsersService', () => {
  let service: TechniciansUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechniciansUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
