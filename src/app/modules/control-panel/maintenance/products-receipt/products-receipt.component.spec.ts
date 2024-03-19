import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsReceiptComponent } from './products-receipt.component';

describe('ProductsReceiptComponent', () => {
  let component: ProductsReceiptComponent;
  let fixture: ComponentFixture<ProductsReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
