import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpecialsOpportunitiesComponent } from './admin-specials-opportunities.component';

describe('AdminSpecialsOpportunitiesComponent', () => {
  let component: AdminSpecialsOpportunitiesComponent;
  let fixture: ComponentFixture<AdminSpecialsOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSpecialsOpportunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpecialsOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
