//Angular imports
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';
import { ScuffCharacter } from '../../class/scuff-character';

import { Timer, timer } from 'd3-timer';

@Component({
  selector: 'app-scuff-character-battle-view',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './scuff-character-battle-view.component.html',
  styleUrl: './scuff-character-battle-view.component.css'
})
export class ScuffCharacterBattleViewComponent {

  constructor(private characterHandler: CharacterHandlerService, private ngZone: NgZone) {}

  hpChange : number = 0;
  shieldsChange :number = 0;

  currentCharacter :ScuffCharacter = new ScuffCharacter;

  isOutputVisible :boolean = false;

  finalScore :string = '';

  traitsString :string = "";
  proficienciesString :string = '';
  implantsString :string = "";
  statusesString :string = "";

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :ScuffCharacter) => {
      this.currentCharacter = value;
    
      this.traitsString = value.traits.join('\n');
      this.proficienciesString = value.proficiencies.join('\n');
      this.implantsString = value.implants.join('\n');
      this.statusesString = value.statuses.join('\n');

    })

  }

  changeCurrentHp() :void {
    this.currentCharacter.currentHp += this.hpChange;
    this.hpChange = 0;
  }

  changeCurrentShields() :void {
    this.currentCharacter.shieldHp = this.shieldsChange;
    this.shieldsChange = 0;
  }

  rollModifier(modifier :number, type :string) :void {
    let randomRoll :number = (Math.floor(Math.random()*20)+1)
    let result :any;
    if (randomRoll == 20) {
      result = 'Natural Twenty!'
    } else if (randomRoll == 1) {
      result = 'Natural One!'
    } else {
      result = randomRoll+Math.ceil((modifier-10)/2);
    } 
    this.finalScore = `The roll for ${type} resulted in: ${result}`;
    this.isOutputVisible = true;
    this.startProgress();
  }

  rollWeapon(weapon :Weapon) :void {
    this.finalScore = weapon.rollWeaponDamage();

    this.isOutputVisible = true;
    this.startProgress();
  }

  saveChanges() :void {

    //all the strings get split back up to arrays 
    this.currentCharacter.traits = this.traitsString.split('\n');
    this.currentCharacter.proficiencies = this.proficienciesString.split('\n');
    this.currentCharacter.implants = this.implantsString.split('\n');
    this.currentCharacter.statuses = this.statusesString.split('\n')

    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter); //the current character gets modified 
    
    this.characterHandler.saveContent(); //all the changes get saved to localstorage
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

}
