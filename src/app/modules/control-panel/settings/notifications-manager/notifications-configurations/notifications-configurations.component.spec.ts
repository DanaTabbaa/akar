import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsConfigurationsComponent } from './notifications-configurations.component';

describe('NotificationsConfigurationsComponent', () => {
  let component: NotificationsConfigurationsComponent;
  let fixture: ComponentFixture<NotificationsConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
