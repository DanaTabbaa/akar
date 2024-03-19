import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasersListComponent } from './purchasers-list.component';

describe('PurchasersListComponent', () => {
  let component: PurchasersListComponent;
  let fixture: ComponentFixture<PurchasersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
