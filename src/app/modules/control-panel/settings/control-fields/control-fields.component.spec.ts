import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFieldsComponent } from './control-fields.component';

describe('ControlFieldsComponent', () => {
  let component: ControlFieldsComponent;
  let fixture: ComponentFixture<ControlFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
