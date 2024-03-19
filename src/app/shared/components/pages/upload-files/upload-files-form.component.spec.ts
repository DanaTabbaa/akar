import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesFormComponent } from './upload-files-form.component';

describe('UploadFilesFormComponent', () => {
  let component: UploadFilesFormComponent;
  let fixture: ComponentFixture<UploadFilesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFilesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
