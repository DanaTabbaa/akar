import { TestBed } from '@angular/core/testing';

import { UploadFilesDialogService } from './upload-files-dialog.service';

describe('UploadFilesDialogService', () => {
  let service: UploadFilesDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFilesDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
