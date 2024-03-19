import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityMetersComponent } from './electricity-meters.component';

describe('ElectricityMetersComponent', () => {
  let component: ElectricityMetersComponent;
  let fixture: ComponentFixture<ElectricityMetersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityMetersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityMetersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
