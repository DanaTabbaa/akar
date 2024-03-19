import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOffersOpportunitiesComponent } from './admin-offers-opportunities.component';

describe('AdminOffersOpportunitiesComponent', () => {
  let component: AdminOffersOpportunitiesComponent;
  let fixture: ComponentFixture<AdminOffersOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOffersOpportunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOffersOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
