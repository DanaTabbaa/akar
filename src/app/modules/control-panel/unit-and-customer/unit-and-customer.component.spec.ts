import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitAndCustomerComponent } from './unit-and-customer.component';

describe('UnitAndCustomerComponent', () => {
  let component: UnitAndCustomerComponent;
  let fixture: ComponentFixture<UnitAndCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitAndCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitAndCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
