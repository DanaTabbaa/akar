import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinantialConstraintsComponent } from './finantial-constraints.component';

describe('FinantialConstraintsComponent', () => {
  let component: FinantialConstraintsComponent;
  let fixture: ComponentFixture<FinantialConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinantialConstraintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinantialConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
