import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpInputComponentComponent } from './otp-input-component.component';

describe('OtpInputComponentComponent', () => {
  let component: OtpInputComponentComponent;
  let fixture: ComponentFixture<OtpInputComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpInputComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
