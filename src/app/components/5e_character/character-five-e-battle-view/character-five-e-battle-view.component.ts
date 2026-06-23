import { Component, NgZone, HostListener, inject } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CharacerFiveESpellsComponent } from '../characer-five-e-spells/characer-five-e-spells.component';

import { CharacterHandlerService } from '../../../services/character-handler.service';
import { TurnHandlerService } from '../../../services/turn-handler.service';
import { BattlerHandlerService } from '../../../services/battler-handler.service';

import { Character5e } from '../../../class/character-5e';
import { ScuffCharacter } from '../../../class/scuff-character';
import { DndtCharacter } from '../../../class/dndt-character';
import { Weapon } from '../../../class/weapon';

import { Modifier5ePipe } from '../../../pipes/modifier-5e.pipe';

import { Timer, timer } from 'd3-timer';

@Component({
  selector: 'app-character-five-e-battle-view',
  imports: [
    FormsModule,
    Modifier5ePipe,
    CharacerFiveESpellsComponent
  ],
  templateUrl: './character-five-e-battle-view.component.html',
  styleUrl: './character-five-e-battle-view.component.css'
})

export class CharacterFiveEBattleViewComponent {

  constructor(
    private characterHandler :CharacterHandlerService,
    private battlerHandler :BattlerHandlerService,
    private turnHandler: TurnHandlerService,
    private ngZone :NgZone
  ) {}

  private activatedRoute = inject(ActivatedRoute);

  currentCharacter  :Character5e = new Character5e;
  
  target :Character5e | ScuffCharacter | DndtCharacter | null = null 

  equipmentString :string = "";
  otherWeaponsAndAttacksString :string = "";
  
  isOutputVisible :boolean = false;

  finalScore :string = ""

  attackInformation :any = null;

  ngOnInit() {
    this.characterHandler.$CurrentCharacter.subscribe((value :Character5e) => {
      this.currentCharacter = value;
      
      const parserOutput = this.characterHandler.characterParser(this.currentCharacter)
      
      if(parserOutput instanceof Character5e) {
        this.currentCharacter = parserOutput
      }


      if(value.equipment) {
        this.equipmentString = value.equipment.join('\n') || '';
        this.otherWeaponsAndAttacksString = value.otherWeaponsAndAttacks.join('\n') || ''
      }

      let weaponsArray :Array<Weapon> = new Array
      this.currentCharacter.weapons.forEach(weapon => {
          weaponsArray.push(Object.assign(new Weapon, weapon))
      });
      this.currentCharacter.weapons = weaponsArray
    })

    this.battlerHandler.$Target.subscribe((value :Character5e | ScuffCharacter | DndtCharacter) => {
      this.target = value;
    })
  }

  toggleSave(count: number): void {
      this.currentCharacter.saves = this.currentCharacter.saves === count ? count - 1 : count;
  }

  toggleFailure(count: number): void {
      this.currentCharacter.failures = this.currentCharacter.failures === count ? count - 1 : count;
  }

  saveChanges() :void {

    //all the strings get split back up to arrays 
    this.currentCharacter.equipment = this.equipmentString.split('\n');
    this.currentCharacter.otherWeaponsAndAttacks = this.otherWeaponsAndAttacksString.split('\n');
  
    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter); //the current character gets modified 
    
    this.characterHandler.saveContent(); //all the changes get saved to localstorage
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
    this.characterHandler.getCampaings();
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

  rollModifier(type :string) :void {
    let randomRoll :number = (Math.floor(Math.random()*20)+1)
    let result :any;
    if (randomRoll == 20) {
      result = 'Natural Twenty!'
    } else if (randomRoll == 1) {
      result='Natural One!'
    } else {
      result = randomRoll+Math.ceil((this.currentCharacter[type]-10)/2);
    }
    this.finalScore = `The roll for ${type} resulted in: ${result}`;
    this.isOutputVisible = true;
    this.startProgress();
  }

  attack(weapon :Weapon, event? :MouseEvent) :void {
    const isShiftDown = !!event && event.shiftKey;

    let advantage = 0;
    let damage = null;
    let rollToHit = 0;

    if(isShiftDown) {
      const inputString = prompt('Input custom roll and damage. One after another, separated by ",".') 
      if(inputString) {
        const inputArray :Array<any> = inputString.split(',') 

        rollToHit = Number(inputArray[0])
        damage = Number(inputArray[1])
      }
    }

    this.battlerHandler.attackTarget(weapon, this.currentCharacter, damage, advantage, rollToHit)

    if(this.activatedRoute.snapshot.url.length == 0) {
      this.finalScore = `
        The attack dealt: ${this.attackInformation.damage}. 
        With a roll to hit of: ${this.attackInformation.rollToHit}
      `;
      this.isOutputVisible = true;
      this.startProgress();
    }

  }

}
