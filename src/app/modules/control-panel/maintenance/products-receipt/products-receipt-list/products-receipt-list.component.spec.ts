import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsReceiptListComponent } from './products-receipt-list.component';

describe('ProductsReceiptListComponent', () => {
  let component: ProductsReceiptListComponent;
  let fixture: ComponentFixture<ProductsReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsReceiptListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
