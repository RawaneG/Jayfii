import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerCategorieComponent } from './creer-categorie.component';

describe('CreerCategorieComponent', () => {
  let component: CreerCategorieComponent;
  let fixture: ComponentFixture<CreerCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerCategorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
