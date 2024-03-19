import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingInvoiceComponent } from './marketing-invoice.component';

describe('MarketingInvoiceComponent', () => {
  let component: MarketingInvoiceComponent;
  let fixture: ComponentFixture<MarketingInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
