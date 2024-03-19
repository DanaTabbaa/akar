import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyActivitiesListComponent } from './company-activities-list.component';

describe('CompanyActivitiesListComponent', () => {
  let component: CompanyActivitiesListComponent;
  let fixture: ComponentFixture<CompanyActivitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyActivitiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyActivitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
