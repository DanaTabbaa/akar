import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceOffersNotificationComponent } from './price-offers-notification.component';

describe('PriceOffersNotificationComponent', () => {
  let component: PriceOffersNotificationComponent;
  let fixture: ComponentFixture<PriceOffersNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceOffersNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceOffersNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
