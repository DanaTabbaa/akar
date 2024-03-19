import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsAndCommisionersComponent } from './commissions-and-commisioners.component';

describe('CommissionsAndCommisionersComponent', () => {
  let component: CommissionsAndCommisionersComponent;
  let fixture: ComponentFixture<CommissionsAndCommisionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionsAndCommisionersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsAndCommisionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
