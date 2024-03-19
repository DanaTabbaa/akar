import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionClientsComponent } from './auction-clients.component';

describe('AuctionClientsComponent', () => {
  let component: AuctionClientsComponent;
  let fixture: ComponentFixture<AuctionClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
