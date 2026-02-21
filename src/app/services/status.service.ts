import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() { }

  public PushStatus(statusArray :Array<any>, statusName :string, stacks :number, doesLower? :boolean) :Array<any> {    

    statusArray.forEach((status, index) => {
        if(status.name == statusName) {
            stacks += status.stacks
            statusArray.splice(index, 1)
        }
    });

    statusArray.push({
        name: statusName,
        stacks: stacks,
        doesLower: doesLower || true
    })

    return statusArray
  }

  public  Bleed = {
        checkForBleed(damageDealt :number, bodyType :string) :number {
            if(damageDealt%2 == 0 && bodyType != 'highly cybernetic' && bodyType != 'mechanical') {
                return 1
            } else 
                return 0 
        },
    
        processBleed(stacks :number) :number {
            return 2*stacks;
        }  
    }

  public Burn = {
      processBurn(stacks :number) :number {
          return stacks*Math.floor((Math.random()*4)+1)
      }

  }    

  public Viral = {
      checkForViral(bodyType :string, stacks :number) :number {
          if(bodyType != 'highly cybernetic' && bodyType != 'mechanical' && stacks <= 3) {
              return 1
          } else {
              return 0
          }
      },
      
      processViral(bodyType :string, stacks :number) :number {
          if(bodyType == 'highly biological' || bodyType == 'heavily mutated') {
              return stacks*4
          } else {
              return stacks*2
          }
      }
  }

  public Vulnerability = {
      checkForVulnerability(rollToHit :number, targetAc :number) :number {
          if((rollToHit >= targetAc && rollToHit%3 == 0) || rollToHit == 20) {
              return 1  
          } else {
              return 0 
          }
      }

  }

  public Bind = {
      checkForBind(rollToHit :number) :number {
          if(rollToHit%2 != 0 && rollToHit%3 != 0) {
              return 1
          } else {
              return 0
          }
      }
      
  }


}
