import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAndFinanceComponent } from './accounting-and-finance.component';

describe('AccountingAndFinanceComponent', () => {
  let component: AccountingAndFinanceComponent;
  let fixture: ComponentFixture<AccountingAndFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingAndFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAndFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
