import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndntCharacterBattleViewComponent } from './dndnt-character-battle-view.component';

describe('DndntCharacterBattleViewComponent', () => {
  let component: DndntCharacterBattleViewComponent;
  let fixture: ComponentFixture<DndntCharacterBattleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndntCharacterBattleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DndntCharacterBattleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
