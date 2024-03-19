import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalInvoiceComponent } from './rental-invoice.component';

describe('RentalInvoiceComponent', () => {
  let component: RentalInvoiceComponent;
  let fixture: ComponentFixture<RentalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
