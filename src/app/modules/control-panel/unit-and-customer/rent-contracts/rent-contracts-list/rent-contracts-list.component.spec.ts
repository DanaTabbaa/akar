import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentContractsListComponent } from './rent-contracts-list.component';

describe('RentContractsListComponent', () => {
  let component: RentContractsListComponent;
  let fixture: ComponentFixture<RentContractsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentContractsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentContractsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
