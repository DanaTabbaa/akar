import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterMetersComponent } from './water-meters.component';

describe('WaterMetersComponent', () => {
  let component: WaterMetersComponent;
  let fixture: ComponentFixture<WaterMetersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterMetersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterMetersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
