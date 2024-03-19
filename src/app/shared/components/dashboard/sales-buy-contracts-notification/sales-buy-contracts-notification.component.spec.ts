import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBuyContractsNotificationComponent } from './sales-buy-contracts-notification.component';

describe('SalesBuyContractsNotificationComponent', () => {
  let component: SalesBuyContractsNotificationComponent;
  let fixture: ComponentFixture<SalesBuyContractsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBuyContractsNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesBuyContractsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
