import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentContractsNotificationComponent } from './rent-contracts-notification.component';

describe('RentContractsNotificationComponent', () => {
  let component: RentContractsNotificationComponent;
  let fixture: ComponentFixture<RentContractsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentContractsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentContractsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
