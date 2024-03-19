import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentContractsSettlementComponent } from './rent-contracts-settlement.component';

describe('RentContractsSettlementComponent', () => {
  let component: RentContractsSettlementComponent;
  let fixture: ComponentFixture<RentContractsSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentContractsSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentContractsSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
