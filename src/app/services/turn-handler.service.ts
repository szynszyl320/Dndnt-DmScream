import { Injectable } from '@angular/core';

import { ScuffCharacter } from '../class/scuff-character';
import { StatusService } from './status.service';

import { Weapon } from '../class/weapon';

@Injectable({
  providedIn: 'root'
})
export class TurnHandlerService {

  constructor(private statusProcessor :StatusService) { }

  processTurnStatus(character :ScuffCharacter) :void {
    character.statuses.forEach((status) => {
      switch(status.name) {
        case('bleed'):
          character.changeCharacterHealth(-1*this.statusProcessor.Bleed.processBleed(status.stacks))
          break;
        
        case('burn'):
          character.changeCharacterHealth(-1*this.statusProcessor.Burn.processBurn(status.stacks))
          break;
        
        case('vulnerability'):
          character.ac = character.baseAc-2
          break;

        case('bind'):
          character.movement = character.baseMovement-status.stacks*2
          if(character.movement <= 0) {
            character.movement = character.baseMovement 
            status.stacks = 0
            character.statuses.push({name :'hamstrung', stacks: 1})
          }
          break;
        
        case('shock'):
          if(status.stacks >= 10) {
            status.stacks = 0
            character.statuses.push({name :'stun', stacks: 1})
          }
          break;
        
        case('stun'):
          if(status.stacks > 1) {
            status.stacks = 1
          }
          break;
        
      }
    })
  }

  proccessAttackStatus(chacaracter: ScuffCharacter, damage: number) :number {
    chacaracter.statuses.forEach((status) => {
      switch(status.name) {
        case 'viral':
          console.log('a');
          
          damage += this.statusProcessor.Viral.processViral(chacaracter.bodyType, status.stacks)
          break;
      }
    })
    
    return damage;
  }

  statusApply(character :ScuffCharacter, damage :number, damageTypes :string, rollToHit :number) :void {
    let damageTypesArray :Array<string> = damageTypes.toLowerCase().trim().split('|')
   
    damageTypesArray.forEach((type :string) => { 
      let isApplied :number = 0 
      let name :string = ''
      let doesLower :boolean = true

      type = type.toLowerCase();
      type = type.trim();

      switch(type) {
        case ('lacerating'):
          isApplied = this.statusProcessor.Bleed.checkForBleed(damage, character.bodyType);
          name = 'bleed'
          break;
        
        case ('blunt'):
          if(rollToHit == 20) {
            isApplied = 1
            name = 'stun'
          }
          break;
        
        case ('piercing'):
          isApplied = this.statusProcessor.Vulnerability.checkForVulnerability(rollToHit, character.ac)
          name = 'vulnerability'
          break;

        case ('slashing'):
          isApplied = this.statusProcessor.Bind.checkForBind(rollToHit)
          name = 'bind'
          break;
        
        case ('fire'):
          isApplied = 1;
          name = 'burn';
          break;
        
        case ('explosion'):
          isApplied = 1;
          name = 'hamstrung';
          break;  
 
        case ('electric'):
          isApplied = 1;
          name = 'shock';
          doesLower = false 
          break;
          
      }
 
      this.statusProcessor.PushStatus(character, name, isApplied, doesLower)
      
    })

  }

  processAttackTypes(damageTypes :String, damage :number, character :ScuffCharacter) :number {
    let damageTypesArray :Array<string> = damageTypes.toLowerCase().trim().split('|')

    damageTypesArray.forEach((type :string) => {
      switch(type) {
        case ('electric'):
          if(character.bodyType == 'highly cybernetic' || character.bodyType == 'mechanical') {
            damage = damage*1.5
          } 
          break;

        case ('heat'):
          if(character.shieldHp > 0) {
            damage = damage*1.5
          }
      }

    });

    return damage 
  }
  



}
