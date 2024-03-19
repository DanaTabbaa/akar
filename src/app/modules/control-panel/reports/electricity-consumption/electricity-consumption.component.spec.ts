import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityConsumptionComponent } from './electricity-consumption.component';

describe('ElectricityConsumptionComponent', () => {
  let component: ElectricityConsumptionComponent;
  let fixture: ComponentFixture<ElectricityConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
