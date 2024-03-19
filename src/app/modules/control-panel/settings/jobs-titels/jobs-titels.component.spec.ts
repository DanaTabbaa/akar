import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTitelsComponent } from './jobs-titels.component';

describe('JobsTitelsComponent', () => {
  let component: JobsTitelsComponent;
  let fixture: ComponentFixture<JobsTitelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsTitelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsTitelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
