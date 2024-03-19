import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentContractsComponent } from './rent-contracts.component';

describe('RentContractsComponent', () => {
  let component: RentContractsComponent;
  let fixture: ComponentFixture<RentContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
