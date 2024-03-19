import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundsListComponent } from './grounds-list.component';

describe('GroundsListComponent', () => {
  let component: GroundsListComponent;
  let fixture: ComponentFixture<GroundsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
