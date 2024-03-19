import { TestBed } from '@angular/core/testing';
import { ProductsReceiptUsersService } from './products-receipt-users.service';


describe('ProductsReceiptUsersService', () => {
  let service: ProductsReceiptUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsReceiptUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
