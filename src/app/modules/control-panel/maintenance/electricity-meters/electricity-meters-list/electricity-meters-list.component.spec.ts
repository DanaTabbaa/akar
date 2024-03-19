import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityMetersListComponent } from './electricity-meters-list.component';

describe('ElectricityMetersListComponent', () => {
  let component: ElectricityMetersListComponent;
  let fixture: ComponentFixture<ElectricityMetersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityMetersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityMetersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
