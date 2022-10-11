import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteDeVenteComponent } from './poste-de-vente.component';

describe('PosteDeVenteComponent', () => {
  let component: PosteDeVenteComponent;
  let fixture: ComponentFixture<PosteDeVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosteDeVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosteDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
