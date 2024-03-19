import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIssueCheckComponent } from './request-issue-check.component';

describe('RequestIssueCheckComponent', () => {
  let component: RequestIssueCheckComponent;
  let fixture: ComponentFixture<RequestIssueCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestIssueCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestIssueCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
