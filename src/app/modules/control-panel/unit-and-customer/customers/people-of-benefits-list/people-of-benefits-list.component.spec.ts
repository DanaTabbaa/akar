import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleOfBenefitsListComponent } from './people-of-benefits-list.component';

describe('PeopleOfBenefitsListComponent', () => {
  let component: PeopleOfBenefitsListComponent;
  let fixture: ComponentFixture<PeopleOfBenefitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleOfBenefitsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleOfBenefitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
