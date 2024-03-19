import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableUnitComponent } from './reusable-unit.component';

describe('ReusableUnitComponent', () => {
  let component: ReusableUnitComponent;
  let fixture: ComponentFixture<ReusableUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusableUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusableUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
