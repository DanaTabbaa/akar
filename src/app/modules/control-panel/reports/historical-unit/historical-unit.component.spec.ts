import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalUnitComponent } from './historical-unit.component';

describe('HistoricalUnitComponent', () => {
  let component: HistoricalUnitComponent;
  let fixture: ComponentFixture<HistoricalUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
