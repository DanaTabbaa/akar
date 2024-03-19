import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDuesComponent } from './voucher-dues.component';

describe('VoucherDuesComponent', () => {
  let component: VoucherDuesComponent;
  let fixture: ComponentFixture<VoucherDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
