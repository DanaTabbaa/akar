import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoticesDeductionsComponent } from './credit-notices-deductions.component';

describe('CreditNoticesDeductionsComponent', () => {
  let component: CreditNoticesDeductionsComponent;
  let fixture: ComponentFixture<CreditNoticesDeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoticesDeductionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoticesDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
