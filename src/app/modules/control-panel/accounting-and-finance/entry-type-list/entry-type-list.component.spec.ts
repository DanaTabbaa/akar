import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryTypeListComponent } from './entry-type-list.component';

describe('EntryTypeListComponent', () => {
  let component: EntryTypeListComponent;
  let fixture: ComponentFixture<EntryTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
