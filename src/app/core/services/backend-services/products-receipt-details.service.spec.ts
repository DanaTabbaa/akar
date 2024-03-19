import { TestBed } from '@angular/core/testing';
import { ProductsReceiptService } from './products-receipt.service';


describe('ProductsReceiptService', () => {
  let service: ProductsReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
