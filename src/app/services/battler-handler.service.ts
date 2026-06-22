import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CharacterHandlerService } from './character-handler.service';
import { TurnHandlerService } from './turn-handler.service';

import { ScuffCharacter } from '../class/scuff-character';
import { Character5e } from '../class/character-5e';
import { DndtCharacter } from '../class/dndt-character';
import { Weapon } from '../class/weapon';


@Injectable({
  providedIn: 'root'
})

export class BattlerHandlerService {

  $Battler :BehaviorSubject<any> = new BehaviorSubject<any>(null)
  $Target :BehaviorSubject<any> = new BehaviorSubject<any>(null)
  $DisplayAttackInformation :BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  $LastAttackDetails :BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private characterHandler : CharacterHandlerService, private turnHandler :TurnHandlerService) {
    this.loadcontent() 
    this.sortArray()  
  }

  switchTargetView() :void {
    try {
      if(this.$DisplayAttackInformation.getValue()) {
        this.$DisplayAttackInformation.next(false);
      } else {
        this.$DisplayAttackInformation.next(true);
      }
    } catch (error) {
      console.error("Failed to switch the view", error);
    }
  }

  loadcontent() :void {
    try {
      let localBattlerSave = localStorage.getItem('dndnt_battler');
      let BattlerSave :any;

      if(localBattlerSave != null) {
        BattlerSave = JSON.parse(localBattlerSave);
      } else {
        BattlerSave = {}
      }

      this.$Battler = new BehaviorSubject<any>(BattlerSave)

      console.log('Battler successfuly loaded');
    } catch (error) {
      this.$Battler.next({})

      console.error('Error loading battler: ', error);
    }
  }

  saveContent() :void {
    try {
      localStorage.setItem('dndnt_battler',JSON.stringify(this.$Battler.getValue()))
      console.log('Battler successfuly saved');
    } catch (error) {
      console.error('Error saving battler state: ', error)
    }
  }

  loadNewCharacter(newCharacter :ScuffCharacter | Character5e | DndtCharacter ) :void {
    try {      
      newCharacter.initiative = Math.floor((Math.random()*20)+1)+Math.floor((newCharacter.dex-10)/2)

      let oldname = newCharacter.name;

      let Characters :Array<any> = [];
      if(this.$Battler.getValue().characters) {
        Characters = this.$Battler.getValue().characters
      }

      Characters.forEach((character) => {
        if (character.name == newCharacter.name) {
          Characters[Characters.length-1].name += ` ${Math.floor(Math.random()*50)}`;
          return
        }
      })

      Characters.push(newCharacter);


      newCharacter.name= oldname;

      let newBattler = this.$Battler.getValue()
      newBattler.characters = Characters;      
      this.$Battler.next(newBattler)  

      // this.characterHandler.changeCharacter(newBattler.characters[-1])

    } catch (error) {
      console.error('Error loading new character', error)
    }
  }

  modifyCharacter(character :ScuffCharacter | Character5e | DndtCharacter, characterIndex :number) :void {
    try {
      let newBattler :any = this.$Battler.getValue()

      if(0 < characterIndex < newBattler.characters.length) {
        newBattler.characters[characterIndex] = character;
      }

      this.$Battler.next(newBattler);

    } catch (error) {
      console.error('Error modfiying character', error);
      
    }
  }

  getCharacterIndex(characterName :string) :number {
    try {
      let characterArray :Array<any> = this.$Battler.getValue().characters; 
      return characterArray.findIndex((character) => {
        return character.name == characterName
      })
    } catch (error) {
      console.error("Couldn't find character", error);
      return -1      
    }
  }

  sortArray() :void {
    try {
      let characterArray :Array<any> = this.$Battler.getValue().characters;
      characterArray.sort((character, nextCharacter) => {
        return nextCharacter.initiative - character.initiative  
      })

      let newBattler :any = this.$Battler.getValue()

      newBattler.characters = characterArray

      this.$Battler.next(newBattler)

    } catch (error) {
      console.error('Error sorting array', error);
    }
  }

  removeCharacter(characterIndex :number) :void {
    try {
      let newBattler :any = this.$Battler.getValue();
      if(-1 < characterIndex && characterIndex < newBattler.characters.length) {
        newBattler.characters.splice(characterIndex, 1)
      } else {
        throw 'character index out of bounds'
      }

      this.$Battler.next(newBattler);

    } catch (error) {
      console.error('Failed to remove character', error)
    }
  }

  selectNewTarget(character :ScuffCharacter | DndtCharacter | Character5e | null) :void {
    try { 
      this.$Target.next(character);
    } catch (error) {
      console.error('Failed to target the character')
    }
  }

  attackTarget(weapon :Weapon, currentCharacter :any, damage :number | null = 0, advantage :number = 0, rollToHit :number | null) :void {
    console.log("Attempting attack");
    try {  
      let target = this.$Target.getValue(); 
      
      let weaponBonus :string = weapon.bonusToHit.substring(0,3).toLowerCase();
    
      let modifier :number = Math.ceil((currentCharacter[weaponBonus]-10)/2)

      let damageRolls :number = 1 

      if(!rollToHit) {
        rollToHit = this.rollD20(modifier, advantage);
      }

      if(target && this.checkAttackMiss(rollToHit)) {
        console.log("Attack failed");
        this.$LastAttackDetails.next(`The roll to hit ${rollToHit} didn't pass the target's AC`);
        return
      }

      if(rollToHit-modifier == 20) {
        damageRolls = 2;
      }

      if(damage == 0 || damage == null) {
        for(let i = 0; i < damageRolls; i++) {
          damage += weapon.rollWeaponDamage()[1]
        }
      }

      if(damage && target instanceof ScuffCharacter) {
        damage = this.turnHandler.processAttackTypes(weapon.damageType, damage, target);
        damage = this.turnHandler.proccessAttackStatus(target, damage);
      }

      if(target && damage) {
        target.changeCharacterHealth(-(damage))
        console.log(damage, "dealt");
        

        this.modifyCharacter(target, this.getCharacterIndex(target.name));

        this.saveContent();
      }

      if(damage && target instanceof ScuffCharacter) {
        this.turnHandler.statusApply(target, damage, weapon.damageType, rollToHit);
      }

      console.log({
        damage: damage,
        rollToHit: rollToHit,
        target: target, 
      });
      
      this.$LastAttackDetails.next({
        damage: damage,
        rollToHit: rollToHit,
        target: target, 
      })
    } catch (error) {
      console.error("failed to roll an attack", error);
    }
  }

  rollD20(modifier :number = 0, advantage :number = 0) :number {
    try {
      let rollToHit :number = Math.floor((Math.random()*20)+1)+modifier;
      let secondRoll :number = Math.floor((Math.random()*20)+1)+modifier;

      if(advantage == 1) {
        if (secondRoll > rollToHit) {
          rollToHit = secondRoll;
        }
      } else if (advantage == -1) {
        if(secondRoll < rollToHit) {
          rollToHit = secondRoll
        }
      }

      return rollToHit;

    } catch (error) {
      console.error("Failed to roll d20", error);
      return 0;
    }
  }

  checkAttackMiss(rollToHit :number = 0) :boolean {
    try {
      if(rollToHit > this.$Target.getValue().ac) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Failed to check if the attack hit", error);
      return true;
    }
  }

}
