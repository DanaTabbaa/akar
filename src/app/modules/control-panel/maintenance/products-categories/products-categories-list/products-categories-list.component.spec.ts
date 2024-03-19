import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategoriesListComponent } from './products-categories-list.component';

describe('ProductsCategoriesListComponent', () => {
  let component: ProductsCategoriesListComponent;
  let fixture: ComponentFixture<ProductsCategoriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsCategoriesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsCategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
