import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResuableUnitServicesComponent } from './resuable-unit-services.component';

describe('ResuableUnitServicesComponent', () => {
  let component: ResuableUnitServicesComponent;
  let fixture: ComponentFixture<ResuableUnitServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResuableUnitServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResuableUnitServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
