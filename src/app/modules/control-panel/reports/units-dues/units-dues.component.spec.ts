import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsDuesComponent } from './units-dues.component';

describe('UnitsDuesComponent', () => {
  let component: UnitsDuesComponent;
  let fixture: ComponentFixture<UnitsDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
