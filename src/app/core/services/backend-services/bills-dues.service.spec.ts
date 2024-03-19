import { TestBed } from '@angular/core/testing';
import { BillsDuesService } from './bills-dues.service';


describe('BillsDuesService', () => {
  let service: BillsDuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillsDuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
