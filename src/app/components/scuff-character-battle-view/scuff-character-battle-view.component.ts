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
    } else {
      result = randomRoll+Math.ceil((modifier-10)/2);
    }
    this.finalScore = `The roll for ${type} resulted in: ${result}`;
    this.isOutputVisible = true;
    this.startProgress();
  }

  rollWeaponDamage(weaponIndex :number) {
    this.finalScore = '';

    const weapon :Weapon = this.currentCharacter.weapons[weaponIndex];
    const damageArray :Array<string> = weapon.damage.split(' ');

    const assignArray :Array<number> = [];
    const scoreArray :Array<number> = [];

    const trimmedDamageArray = damageArray.map((subString :string) => {
      return subString.replace(/(\(.*?\)|\+)/g, '').trim();
    })


    trimmedDamageArray.forEach((damageDeal :string) => {
        
      if(damageDeal.includes('d')) {
          let temporaryArray :Array<any> = damageDeal.split('d');
          
          temporaryArray = temporaryArray.map((num :string) => {
            return parseInt(num);
          }) 
          
          assignArray.push(temporaryArray[0])
          for(let i :number = 0; i < temporaryArray[0]; i++) {
            scoreArray.push(Math.floor(Math.random()*temporaryArray[1]) +1);
          }
        
        } else if (!isNaN(parseInt(damageDeal))) {
          assignArray.push(1)
          scoreArray.push(parseInt(damageDeal))
        
        }
    })   

    let returnScore :string = "";
    let offset :number = 0;

    for (let i :number = 0; i < assignArray.length; i++) {
      let temporaryScore = 0;  
      for (let j :number =  0; j < assignArray[i]; j++) {
        temporaryScore += scoreArray[offset + j];
      }
      offset += assignArray[i];
      returnScore += ` +${temporaryScore} |`;
    }
    
    let result :number = 0;
    scoreArray.forEach(score => {
      result += score;
    });

    this.finalScore = `The roll for damage was: ${result}. Specifically speaking: | ${returnScore}`

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
