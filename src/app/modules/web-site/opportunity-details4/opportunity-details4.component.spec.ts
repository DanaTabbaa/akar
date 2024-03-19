import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityDetails4Component } from './opportunity-details4.component';

describe('OpportunityDetails4Component', () => {
  let component: OpportunityDetails4Component;
  let fixture: ComponentFixture<OpportunityDetails4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityDetails4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityDetails4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
