import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickModalComponent } from './quick-modal.component';

describe('QuickModalComponent', () => {
  let component: QuickModalComponent;
  let fixture: ComponentFixture<QuickModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
