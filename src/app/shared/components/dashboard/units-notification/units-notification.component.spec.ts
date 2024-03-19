import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsNotificationComponent } from './units-notification.component';

describe('UnitsNotificationComponent', () => {
  let component: UnitsNotificationComponent;
  let fixture: ComponentFixture<UnitsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
