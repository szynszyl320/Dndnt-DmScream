//Angular imports
import { Component, NgZone, HostListener, input } from '@angular/core';
import { FormsModule, StatusChangeEvent } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';
import { TurnHandlerService } from '../../services/turn-handler.service';
import { BattlerHandlerService } from '../../services/battler-handler.service';
import { StatusService } from '../../services/status.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';
import { ScuffCharacter } from '../../class/scuff-character';

import { Timer, timer } from 'd3-timer';
import { DndtCharacter } from '../../class/dndt-character';

@Component({
  selector: 'app-scuff-character-battle-view',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './scuff-character-battle-view.component.html',
  styleUrl: './scuff-character-battle-view.component.css'
})
export class ScuffCharacterBattleViewComponent {

  constructor(
    private characterHandler: CharacterHandlerService, 
    private ngZone: NgZone, 
    private turnHandler :TurnHandlerService,
    private battlerHandler :BattlerHandlerService,
    private statusHandler :StatusService
  ) {}

  hpChange : number = 0;
  shieldsChange :number = 0;

  currentCharacter :ScuffCharacter = new ScuffCharacter;

  isOutputVisible :boolean = false;

  finalScore :string = '';

  traitsString :string = "";
  proficienciesString :string = '';
  implantsString :string = "";
  target :ScuffCharacter | DndtCharacter | null = null

  statusEffectName :string = ""
  statusEffectStacks :number = 0
  statusEffectDoesLower :boolean = true

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :ScuffCharacter) => {
      this.currentCharacter = value;
    
      this.traitsString = value.traits.join('\n');
      this.proficienciesString = value.proficiencies.join('\n');
      this.implantsString = value.implants.join('\n');

      let weaponsArray :Array<Weapon> = new Array
      this.currentCharacter.weapons.forEach(weapon => {
          weaponsArray.push(Object.assign(new Weapon, weapon))
      });
      this.currentCharacter.weapons = weaponsArray
    })

    this.battlerHandler.$Target.subscribe((value :ScuffCharacter | DndtCharacter | null) => {
      this.target = value
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
    let weaponOutput = weapon.rollWeaponDamage()

    this.finalScore = weaponOutput[0];    

    this.isOutputVisible = true;
    this.startProgress();
  }

  saveChanges() :void {

    //all the strings get split back up to arrays 
    this.currentCharacter.traits = this.traitsString.split('\n');
    this.currentCharacter.proficiencies = this.proficienciesString.split('\n');
    this.currentCharacter.implants = this.implantsString.split('\n');
    
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


  removeStatusStacks(stackAmount :number, index :number) :void {
    if(stackAmount == this.currentCharacter.statuses[index].stacks) {
      this.currentCharacter.statuses.splice(index,1)
    } else {
      this.currentCharacter.statuses[index].stacks -= stackAmount
    }
    this.battlerHandler.saveContent()
  }

  addNewStatusEffect() {
    if(this.statusEffectStacks > 0) {
      this.statusHandler.PushStatus(this.currentCharacter, this.statusEffectName.trim().toLowerCase(), this.statusEffectStacks, this.statusEffectDoesLower)
    }
    
    this.statusEffectName = "";
    this.statusEffectStacks = 0;
    this.statusEffectDoesLower = true;
    
    this.battlerHandler.saveContent();

  }

}
