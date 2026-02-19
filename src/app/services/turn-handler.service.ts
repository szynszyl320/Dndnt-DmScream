import { Injectable } from '@angular/core';

import { ScuffCharacter } from '../class/scuff-character';
import { StatusService } from '../status.service';

@Injectable({
  providedIn: 'root'
})
export class TurnHandlerService {

  constructor(private statusProcessor :StatusService) { }
    
  processTurn(character :ScuffCharacter) :void {
    
  }

  statusApply(character :ScuffCharacter, damage :number, damageTypes :Array<any>, rollToHit :number) :Array<any> {
    
    let returnArray :Array<any> = []
    
    damageTypes.forEach((type :string) => { 
      let isApplied :number = 0 
      let name :string = ''

      type = type.toLowerCase();
      type = type.trim();

      switch(type) {
        case 'lacerating':
          isApplied = this.statusProcessor.Bleed.checkForBleed(damage, character.bodyType);
          name = 'bleed'
          break;
        
        case 'blunt':
          if(rollToHit == 20) {
            isApplied = 1
            name = 'stun'
          }
          break;
        
        case 'piercing':
          isApplied = this.statusProcessor.Vulnerability.checkForVulnerability(rollToHit, character.ac)
          name = 'vulnerability'
          break;

        case 'slashing':
          isApplied = this.statusProcessor.Bind.checkForBind(rollToHit)
          name = 'Bind'
          break;
        
        case 'fire':
          isApplied = 1;
          name = 'Burn';
          break;
        
        case 'explosion':
          isApplied = 1;
          name = 'hamstrung';
          break;  
      }
 

      if(isApplied) {
        returnArray.push(this.statusProcessor.PushStatus(character.statuses, name, isApplied) )
      }
    })

    return returnArray

  }

  



}
