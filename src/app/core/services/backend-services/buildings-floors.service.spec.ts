import { TestBed } from '@angular/core/testing';

import { BuildingsFloorsService } from './buildings-floors.service';

describe('BuildingsFloorsService', () => {
  let service: BuildingsFloorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingsFloorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
