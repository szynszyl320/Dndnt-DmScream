import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacerFiveESpellsComponent } from './characer-five-e-spells.component';

describe('CharacerFiveESpellsComponent', () => {
  let component: CharacerFiveESpellsComponent;
  let fixture: ComponentFixture<CharacerFiveESpellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacerFiveESpellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacerFiveESpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
