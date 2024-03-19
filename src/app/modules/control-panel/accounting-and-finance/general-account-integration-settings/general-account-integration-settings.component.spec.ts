import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAccountIntegrationSettingsComponent } from './general-account-integration-settings.component';

describe('GeneralAccountIntegrationSettingsComponent', () => {
  let component: GeneralAccountIntegrationSettingsComponent;
  let fixture: ComponentFixture<GeneralAccountIntegrationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralAccountIntegrationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAccountIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
