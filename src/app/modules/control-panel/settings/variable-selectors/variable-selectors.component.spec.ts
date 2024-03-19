import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableSelectorsComponent } from './variable-selectors.component';

describe('VariableSelectorsComponent', () => {
  let component: VariableSelectorsComponent;
  let fixture: ComponentFixture<VariableSelectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableSelectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableSelectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
