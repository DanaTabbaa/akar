import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsNotificationComponent } from './tenants-notification.component';

describe('TenantsNotificationComponent', () => {
  let component: TenantsNotificationComponent;
  let fixture: ComponentFixture<TenantsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
