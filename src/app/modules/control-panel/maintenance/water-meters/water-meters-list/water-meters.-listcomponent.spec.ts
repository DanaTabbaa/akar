import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterMetersListComponent } from './water-meters-list.component';

describe('WaterMetersListComponent', () => {
  let component: WaterMetersListComponent;
  let fixture: ComponentFixture<WaterMetersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterMetersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterMetersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
