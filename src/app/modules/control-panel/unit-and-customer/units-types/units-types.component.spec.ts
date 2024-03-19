import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsTypesComponent } from './units-types.component';

describe('UnitsTypesComponent', () => {
  let component: UnitsTypesComponent;
  let fixture: ComponentFixture<UnitsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
