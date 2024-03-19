import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpecialsOpportunitiesListComponent } from './admin-specials-opportunities-list.component';

describe('AdminSpecialsOpportunitiesListComponent', () => {
  let component: AdminSpecialsOpportunitiesListComponent;
  let fixture: ComponentFixture<AdminSpecialsOpportunitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSpecialsOpportunitiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpecialsOpportunitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
