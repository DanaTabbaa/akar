import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityDetails2Component } from './opportunity-details2.component';

describe('OpportunityDetails2Component', () => {
  let component: OpportunityDetails2Component;
  let fixture: ComponentFixture<OpportunityDetails2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityDetails2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
