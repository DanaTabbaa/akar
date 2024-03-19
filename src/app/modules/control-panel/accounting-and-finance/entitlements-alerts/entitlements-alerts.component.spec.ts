import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitlementsAlertsComponent } from './entitlements-alerts.component';

describe('EntitlementsAlertsComponent', () => {
  let component: EntitlementsAlertsComponent;
  let fixture: ComponentFixture<EntitlementsAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitlementsAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitlementsAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
