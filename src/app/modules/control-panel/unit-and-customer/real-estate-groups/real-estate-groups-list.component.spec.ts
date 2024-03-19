import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateGroupsListComponent } from './real-estate-groups-list.component';

describe('RealEstateGroupsListComponent', () => {
  let component: RealEstateGroupsListComponent;
  let fixture: ComponentFixture<RealEstateGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateGroupsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
