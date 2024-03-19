import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingRequestsComponent } from './pricing-requests.component';

describe('PricingRequestsComponent', () => {
  let component: PricingRequestsComponent;
  let fixture: ComponentFixture<PricingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
