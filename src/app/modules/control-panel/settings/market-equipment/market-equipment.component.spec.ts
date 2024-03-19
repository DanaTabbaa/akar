import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketEquipmentComponent } from './market-equipment.component';

describe('MarketEquipmentComponent', () => {
  let component: MarketEquipmentComponent;
  let fixture: ComponentFixture<MarketEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketEquipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
