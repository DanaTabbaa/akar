import { TestBed } from '@angular/core/testing';

import {  WaterMetersService } from './water-meters.service';

describe('WaterMetersService', () => {
  let service: WaterMetersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaterMetersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
