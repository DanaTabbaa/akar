import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityDetails1Component } from './opportunity-details1.component';

describe('OpportunityDetails1Component', () => {
  let component: OpportunityDetails1Component;
  let fixture: ComponentFixture<OpportunityDetails1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityDetails1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityDetails1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
