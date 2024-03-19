import { TestBed } from '@angular/core/testing';

import { UploadFilesApiService } from './upload-files-api.service';

describe('UploadFilesApiService', () => {
  let service: UploadFilesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFilesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
