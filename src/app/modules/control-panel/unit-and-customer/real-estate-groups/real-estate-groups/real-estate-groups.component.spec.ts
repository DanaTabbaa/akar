import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateGroupsComponent } from './real-estate-groups.component';

describe('RealEstateGroupsComponent', () => {
  let component: RealEstateGroupsComponent;
  let fixture: ComponentFixture<RealEstateGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
