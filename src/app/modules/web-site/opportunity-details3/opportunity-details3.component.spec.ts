import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitDetail3Component } from './opportunit-detail3.component';

describe('OpportunitDetail3Component', () => {
  let component: OpportunitDetail3Component;
  let fixture: ComponentFixture<OpportunitDetail3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitDetail3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitDetail3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
