import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionRevenueDueComponent } from './distribution-revenue-due.component';

describe('DistributionRevenueDueComponent', () => {
  let component: DistributionRevenueDueComponent;
  let fixture: ComponentFixture<DistributionRevenueDueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionRevenueDueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionRevenueDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
