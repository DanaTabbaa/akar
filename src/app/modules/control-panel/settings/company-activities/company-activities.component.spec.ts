import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyActivitiesComponent } from './company-activities.component';

describe('CompanyActivitiesComponent', () => {
  let component: CompanyActivitiesComponent;
  let fixture: ComponentFixture<CompanyActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
