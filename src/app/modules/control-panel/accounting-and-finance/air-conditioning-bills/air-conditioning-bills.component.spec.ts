import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirConditioningBillsComponent } from './air-conditioning-bills.component';

describe('AirConditioningBillsComponent', () => {
  let component: AirConditioningBillsComponent;
  let fixture: ComponentFixture<AirConditioningBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirConditioningBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirConditioningBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
