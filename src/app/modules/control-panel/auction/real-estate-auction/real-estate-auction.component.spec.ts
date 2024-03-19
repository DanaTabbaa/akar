import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateAuctionComponent } from './real-estate-auction.component';

describe('RealEstateAuctionComponent', () => {
  let component: RealEstateAuctionComponent;
  let fixture: ComponentFixture<RealEstateAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateAuctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
