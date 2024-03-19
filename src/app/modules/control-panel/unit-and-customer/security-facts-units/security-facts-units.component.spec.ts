import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityFactsUnitsComponent } from './security-facts-units.component';

describe('SecurityFactsUnitsComponent', () => {
  let component: SecurityFactsUnitsComponent;
  let fixture: ComponentFixture<SecurityFactsUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityFactsUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityFactsUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
