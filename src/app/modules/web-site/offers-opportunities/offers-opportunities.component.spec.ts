import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersOpportunitiesComponent } from './offers-opportunities.component';

describe('OffersOpportunitiesComponent', () => {
  let component: OffersOpportunitiesComponent;
  let fixture: ComponentFixture<OffersOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersOpportunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
