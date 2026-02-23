import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFiveEBattleViewComponent } from './character-five-e-battle-view.component';

describe('CharacterFiveEBattleViewComponent', () => {
  let component: CharacterFiveEBattleViewComponent;
  let fixture: ComponentFixture<CharacterFiveEBattleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFiveEBattleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFiveEBattleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
