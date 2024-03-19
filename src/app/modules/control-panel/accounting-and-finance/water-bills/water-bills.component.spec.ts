import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterBillsComponent } from './water-bills.component';

describe('WaterBillsComponent', () => {
  let component: WaterBillsComponent;
  let fixture: ComponentFixture<WaterBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
