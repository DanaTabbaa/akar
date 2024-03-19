import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuationsComponent } from './quations.component';

describe('QuationsComponent', () => {
  let component: QuationsComponent;
  let fixture: ComponentFixture<QuationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
