import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentsDuesComponent } from './rents-dues.component';

describe('RentsDuesComponent', () => {
  let component: RentsDuesComponent;
  let fixture: ComponentFixture<RentsDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentsDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentsDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
