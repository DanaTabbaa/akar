import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerviewUploadedFilesComponent } from './perview-uploaded-files.component';

describe('PerviewUploadedFilesComponent', () => {
  let component: PerviewUploadedFilesComponent;
  let fixture: ComponentFixture<PerviewUploadedFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerviewUploadedFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerviewUploadedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
