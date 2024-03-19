import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillExchangeComponent } from './bill-exchange.component';

describe('BillExchangeComponent', () => {
  let component: BillExchangeComponent;
  let fixture: ComponentFixture<BillExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
