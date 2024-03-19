import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateOfficesComponent } from './real-estate-offices.component';

describe('RealEstateOfficesComponent', () => {
  let component: RealEstateOfficesComponent;
  let fixture: ComponentFixture<RealEstateOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateOfficesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
