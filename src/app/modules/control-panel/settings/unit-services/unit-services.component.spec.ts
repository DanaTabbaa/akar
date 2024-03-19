import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitServicesComponent } from './unit-services.component';

describe('UnitServicesComponent', () => {
  let component: UnitServicesComponent;
  let fixture: ComponentFixture<UnitServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
