import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablRentContractDuesComponent } from './reusable-rent-contract-dues.component';

describe('ReusablRentContractDuesComponent', () => {
  let component: ReusablRentContractDuesComponent;
  let fixture: ComponentFixture<ReusablRentContractDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusablRentContractDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusablRentContractDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
