import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Formulario1Page } from './formulario1.page';

describe('Formulario1Page', () => {
  let component: Formulario1Page;
  let fixture: ComponentFixture<Formulario1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Formulario1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
