import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCashingVouchersComponent } from './check-cashing-vouchers.component';

describe('CheckCashingVouchersComponent', () => {
  let component: CheckCashingVouchersComponent;
  let fixture: ComponentFixture<CheckCashingVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckCashingVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckCashingVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
