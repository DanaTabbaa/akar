import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEntryBenefitComponent } from './generate-entry-benefit.component';

describe('GenerateEntryBenefitComponent', () => {
  let component: GenerateEntryBenefitComponent;
  let fixture: ComponentFixture<GenerateEntryBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateEntryBenefitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateEntryBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
