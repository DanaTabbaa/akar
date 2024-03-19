import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleOfBenefitsComponent } from './people-of-benefits.component';

describe('PeopleOfBenefitsComponent', () => {
  let component: PeopleOfBenefitsComponent;
  let fixture: ComponentFixture<PeopleOfBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleOfBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleOfBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
