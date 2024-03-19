import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServantsComponent } from './servants.component';

describe('ServantsComponent', () => {
  let component: ServantsComponent;
  let fixture: ComponentFixture<ServantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
