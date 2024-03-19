import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsTypesListComponent } from './units-types-list.component';

describe('UnitsTypesListComponent', () => {
  let component: UnitsTypesListComponent;
  let fixture: ComponentFixture<UnitsTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
