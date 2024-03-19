import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiblePersonsComponent } from './responsible-persons.component';

describe('ResponsiblePersonsComponent', () => {
  let component: ResponsiblePersonsComponent;
  let fixture: ComponentFixture<ResponsiblePersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsiblePersonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiblePersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
