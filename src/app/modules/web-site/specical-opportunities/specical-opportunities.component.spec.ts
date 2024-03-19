import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecicalOpportunitiesComponent } from './specical-opportunities.component';

describe('SpecicalOpportunitiesComponent', () => {
  let component: SpecicalOpportunitiesComponent;
  let fixture: ComponentFixture<SpecicalOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecicalOpportunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecicalOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
