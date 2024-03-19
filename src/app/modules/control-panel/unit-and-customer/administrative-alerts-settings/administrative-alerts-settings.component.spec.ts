import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeAlertsSettingsComponent } from './administrative-alerts-settings.component';

describe('AdministrativeAlertsSettingsComponent', () => {
  let component: AdministrativeAlertsSettingsComponent;
  let fixture: ComponentFixture<AdministrativeAlertsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrativeAlertsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeAlertsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
