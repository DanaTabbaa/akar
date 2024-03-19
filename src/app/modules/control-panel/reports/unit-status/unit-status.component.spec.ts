import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitStatusComponent } from './unit-status.component';

describe('UnitStatusComponent', () => {
  let component: UnitStatusComponent;
  let fixture: ComponentFixture<UnitStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
