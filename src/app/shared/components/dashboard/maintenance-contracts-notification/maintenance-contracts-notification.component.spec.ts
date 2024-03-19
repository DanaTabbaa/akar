import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceContractsNotificationComponent } from './maintenance-contracts-notification.component';

describe('MaintenanceContractsNotificationComponent', () => {
  let component: MaintenanceContractsNotificationComponent;
  let fixture: ComponentFixture<MaintenanceContractsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceContractsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceContractsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
