import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesTypesComponent } from './opportunities-types.component';

describe('OpportunitiesTypesComponent', () => {
  let component: OpportunitiesTypesComponent;
  let fixture: ComponentFixture<OpportunitiesTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitiesTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitiesTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
