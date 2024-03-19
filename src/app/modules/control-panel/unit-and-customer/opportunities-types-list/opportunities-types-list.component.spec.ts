import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesTypesListComponent } from './opportunities-types-list.component';

describe('OpportunitiesTypeListComponent', () => {
  let component: OpportunitiesTypesListComponent;
  let fixture: ComponentFixture<OpportunitiesTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitiesTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitiesTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
