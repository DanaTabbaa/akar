import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportuityMapPopupComponent } from './opportuity-map-popup.component';

describe('OpportuityMapPopupComponent', () => {
  let component: OpportuityMapPopupComponent;
  let fixture: ComponentFixture<OpportuityMapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportuityMapPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportuityMapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
