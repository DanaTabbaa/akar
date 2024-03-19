import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsOfDeliveryandReceiptComponent } from './records-of-delivery-and-receipt.component';

describe('RecordsOfDeliveryandReceiptComponent', () => {
  let component: RecordsOfDeliveryandReceiptComponent;
  let fixture: ComponentFixture<RecordsOfDeliveryandReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordsOfDeliveryandReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsOfDeliveryandReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
