import { TestBed } from '@angular/core/testing';
import { CostCenterUserService } from './cost-center-user.service';


describe('CostCenterUserService', () => {
  let service: CostCenterUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostCenterUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
