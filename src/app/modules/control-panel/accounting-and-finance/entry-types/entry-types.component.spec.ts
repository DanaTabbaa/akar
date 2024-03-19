import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryTypesComponent } from './entry-types.component';

describe('EntryTypesComponent', () => {
  let component: EntryTypesComponent;
  let fixture: ComponentFixture<EntryTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
