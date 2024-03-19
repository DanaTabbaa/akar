import { TestBed } from '@angular/core/testing';

import { QuickModalService } from './quick-modal.service';

describe('QuickModalService', () => {
  let service: QuickModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
