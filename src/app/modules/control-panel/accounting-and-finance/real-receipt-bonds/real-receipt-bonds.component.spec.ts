import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealReceiptBondsComponent } from './real-receipt-bonds.component';

describe('RealReceiptBondsComponent', () => {
  let component: RealReceiptBondsComponent;
  let fixture: ComponentFixture<RealReceiptBondsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealReceiptBondsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealReceiptBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
