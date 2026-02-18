//Angular imports
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';
import { DndtCharacter } from '../../class/dndt-character';

//External library imports
import { Timer, timer } from 'd3-timer';

@Component({
  selector: 'app-dndnt-character-battle-view',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './dndnt-character-battle-view.component.html',
  styleUrl: './dndnt-character-battle-view.component.css'
})


export class DndntCharacterBattleViewComponent {

  constructor(private characterHandler: CharacterHandlerService, private ngZone :NgZone) {};

  currentCharacter :DndtCharacter = new DndtCharacter;

  hpChange :number = 0;
  maxHpChange :number = 0;

  woundsString :string = "";

  isOutputVisible :boolean = false;

  finalScore :string = "";

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :DndtCharacter) => {

      this.currentCharacter = value;

      this.woundsString = value.wounds.join('\n')
    })

  }

  changeCurrentHp() :void {
    this.currentCharacter.currentHp += this.hpChange;
    this.hpChange = 0;
  }

  changeCurrentMaxHp() :void {
    this.currentCharacter.maxHp += this.maxHpChange;
    this.maxHpChange = 0;
  }

  saveChanges() :void {
    this.currentCharacter.wounds = this.woundsString.split('\n');
    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);
    this.characterHandler.saveContent();
  }

  progress: number = 0;             
  isProgressRunning: boolean = false;
  progressTimer?: Timer;

  startProgress(durationMs: number = 2000): void {
    // reset
    this.stopProgress();
    this.progress = 0;
    this.isProgressRunning = true;

    // d3-timer callback runs often; wrap updates in ngZone to trigger Angular change detection
    const t = timer((elapsed: number) => {
      this.ngZone.run(() => {
        this.progress = Math.min(1, elapsed / durationMs);
        if (this.progress >= 1) {
          this.isOutputVisible = false;
          t.stop();
          this.isProgressRunning = false;
        }
      });
    });

    this.progressTimer = t;
  }

  stopProgress(): void {
    if (this.progressTimer) {
      this.progressTimer.stop();
      this.progressTimer = undefined;
    }
    this.isProgressRunning = false;
  }

  hideOutput() {
    if(this.isProgressRunning) {
      this.stopProgress();
    } else {
      this.isOutputVisible = false;
    }
  }

  //Listener that triggers the function saveChanges anytime an input gets modified in any way. 
  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
    this.characterHandler.getCampaings();
  }

  rollModifier(modifier :number, type :string) :void {
    let randomRoll :number = (Math.floor(Math.random()*20)+1)
    let result :any;
    if (randomRoll == 20) {
      result = 'Natural Twenty!'
    } else if (randomRoll == 1) {
      result='Natural One!'
    } else {
      result = randomRoll+Math.ceil((modifier-10)/2);
    }
    this.finalScore = `The roll for ${type} resulted in: ${result}`;
    this.isOutputVisible = true;
    this.startProgress();
  }

  rollWeapon(weapon :Weapon) {
    this.finalScore = weapon.rollWeaponDamage();
    this.isOutputVisible = true;
    this.startProgress();
  }

}
