//Angular imports
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule} from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';
import { BattlerHandlerService } from '../../services/battler-handler.service';
import { TurnHandlerService } from '../../services/turn-handler.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';
import { DndtCharacter } from '../../class/dndt-character';

//External library imports
import { Timer, timer } from 'd3-timer';
import { ScuffCharacter } from '../../class/scuff-character';
import { DndntCharacterComponent } from '../dndnt-character/dndnt-character.component';
import { Character5e } from '../../class/character-5e';

@Component({
  selector: 'app-dndnt-character-battle-view',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './dndnt-character-battle-view.component.html',
  styleUrl: './dndnt-character-battle-view.component.css'
})


export class DndntCharacterBattleViewComponent {

  constructor(
    private characterHandler: CharacterHandlerService, 
    private ngZone :NgZone, 
    private battlerHandler :BattlerHandlerService,
    private turnHandler :TurnHandlerService
  ) {};

  currentCharacter :DndtCharacter = new DndtCharacter;

  target :ScuffCharacter | DndtCharacter | Character5e | null = null

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

    this.battlerHandler.$Target.subscribe((value :ScuffCharacter | DndtCharacter | Character5e) => {

      this.target = value 

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
    this.finalScore = weapon.rollWeaponDamage()[0];
    this.isOutputVisible = true;
    this.startProgress();
  }

  attack(weapon :Weapon, event? :MouseEvent, advantage :number = 0, damage :number = 0, rollToHit? :number) :void {
      const isShiftDown = !!event && event.shiftKey;
  
      if(isShiftDown) {
        const inputString = prompt('Input custom roll and damage. One after another, separated by ",".') 
        if(inputString) {
          const inputArray :Array<any> = inputString.split(',') 
  
          rollToHit = Number(inputArray[0])
          damage = Number(inputArray[1])
        }
  
      }
  
      //Getting the bonus to hit from the weapon 
      let weaponBonus :string = weapon.bonusToHit.substring(0,3).toLowerCase()
      
      let modifier :number = (Math.ceil((this.currentCharacter[weaponBonus]-10)/2))
  
      let damageRolls :number = 1
  
      //Rolling to hit and checking advantages 
      if(!rollToHit) {
        rollToHit = Math.floor((Math.random()*20)+1)+modifier
         
        //The character has advantage 
        if (advantage == 1) {
          let secondRoll = Math.floor((Math.random()*20)+1)+modifier
          if (secondRoll > rollToHit) {
            rollToHit = secondRoll
          }
        
        //The character has disadvantage 
        } else if (advantage == -1) {
          let secondRoll = Math.floor((Math.random()*20)+1)+modifier
          if (secondRoll < rollToHit) {
            rollToHit = secondRoll
          }
        }
      }
  
      //Checking if the attack hit 
      if(this.target != null) {
        if(this.target.ac > rollToHit) {
          this.finalScore = `The roll to hit ${rollToHit} didn't pass the ac ${this.target.ac}`
          this.isOutputVisible = true
          this.startProgress()
          return
        }
      }
  
      if(rollToHit-modifier == 20) {
        damageRolls = 2
      }
  
      //Checking if the damage has already been preinputed 
      for (let index = 0; index < damageRolls; index++) {
        if(damage == 0) {
          damage += weapon.rollWeaponDamage()[1]
        }
  
      //Processing the damage statuses and damage types
        if(this.target != null && damage && this.target instanceof ScuffCharacter) {
          damage = this.turnHandler.processAttackTypes(weapon.damageType, damage, this.target)
          damage = this.turnHandler.proccessAttackStatus(this.target, damage)
        }
      }
  
      //apply the damage to the target 
      if(this.target != null && damage) {
        this.target.changeCharacterHealth(-1*(damage))
        
        this.battlerHandler.modifyCharacter(this.target, this.battlerHandler.getCharacterIndex(this.target.name))
  
        this.battlerHandler.saveContent();
      }
  
      //apply the statuses
      if(this.target != null && damage && this.target instanceof ScuffCharacter) {
        this.turnHandler.statusApply(this.target, damage, weapon.damageType, rollToHit);
      }
  
      this.finalScore = `The roll to hit ${rollToHit} passed. The attack dealt ${damage} damage!`
      this.isOutputVisible = true;
      this.startProgress();
    }

}
