import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOffersOpportunitiesListComponent } from './admin-offers-opportunities-list.component';

describe('AdminOffersOpportunitiesListComponent', () => {
  let component: AdminOffersOpportunitiesListComponent;
  let fixture: ComponentFixture<AdminOffersOpportunitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOffersOpportunitiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOffersOpportunitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
