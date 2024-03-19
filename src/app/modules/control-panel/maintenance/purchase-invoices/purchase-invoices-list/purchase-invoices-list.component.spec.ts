import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoicesListComponent } from './purchase-invoices-list.component';

describe('PurchaseInvoicesListComponent', () => {
  let component: PurchaseInvoicesListComponent;
  let fixture: ComponentFixture<PurchaseInvoicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
