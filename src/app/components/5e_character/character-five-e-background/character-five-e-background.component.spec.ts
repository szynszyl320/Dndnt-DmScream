import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFiveEBackgroundComponent } from './character-five-e-background.component';

describe('CharacterFiveEBackgroundComponent', () => {
  let component: CharacterFiveEBackgroundComponent;
  let fixture: ComponentFixture<CharacterFiveEBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFiveEBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFiveEBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
