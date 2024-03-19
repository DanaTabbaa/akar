import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionSystemComponent } from './auction-system.component';

describe('AuctionSystemComponent', () => {
  let component: AuctionSystemComponent;
  let fixture: ComponentFixture<AuctionSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
