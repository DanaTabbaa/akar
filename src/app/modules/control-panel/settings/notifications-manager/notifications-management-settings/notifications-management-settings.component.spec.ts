import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsManagementSettingsComponent } from './notifications-management-settings.component';

describe('NotificationsManagementSettingsComponent', () => {
  let component: NotificationsManagementSettingsComponent;
  let fixture: ComponentFixture<NotificationsManagementSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsManagementSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
