import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsFeesComponent } from './auctions-fees.component';

describe('AuctionsFeesComponent', () => {
  let component: AuctionsFeesComponent;
  let fixture: ComponentFixture<AuctionsFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionsFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionsFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
