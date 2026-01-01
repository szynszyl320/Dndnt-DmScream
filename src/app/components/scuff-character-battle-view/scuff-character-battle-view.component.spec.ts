import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScuffCharacterBattleViewComponent } from './scuff-character-battle-view.component';

describe('ScuffCharacterBattleViewComponent', () => {
  let component: ScuffCharacterBattleViewComponent;
  let fixture: ComponentFixture<ScuffCharacterBattleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScuffCharacterBattleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScuffCharacterBattleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
