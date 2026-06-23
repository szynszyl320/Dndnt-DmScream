//Angular imports
import { Component, NgZone, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';
import { BattlerHandlerService } from '../../services/battler-handler.service';
import { StatusService } from '../../services/status.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';
import { ScuffCharacter } from '../../class/scuff-character';

import { Timer, timer } from 'd3-timer';
import { DndtCharacter } from '../../class/dndt-character';
import { Character5e } from '../../class/character-5e';
import { BattlerComponent } from '../battler/battler.component';

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
    private battlerHandler :BattlerHandlerService,
    private statusHandler :StatusService
  ) {}

  private activatedRoute = inject(ActivatedRoute);

  hpChange : number = 0;
  shieldsChange :number = 0;

  currentCharacter :ScuffCharacter = new ScuffCharacter;

  isOutputVisible :boolean = false;

  finalScore :string = '';

  traitsString :string = "";
  proficienciesString :string = '';
  implantsString :string = "";
  target :ScuffCharacter | DndtCharacter | Character5e | null = null

  statusEffectName :string = ""
  statusEffectStacks :number = 0
  statusEffectDoesLower :boolean = true

  attackInformation :any = null;

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :ScuffCharacter) => {
      this.currentCharacter = value;

      const parserOutput = this.characterHandler.characterParser(this.currentCharacter)
      
      if(parserOutput instanceof ScuffCharacter) {
        this.currentCharacter = parserOutput
      }

      if(value.implants) {
        this.traitsString = value.traits.join('\n');
        this.proficienciesString = value.proficiencies.join('\n');
        this.implantsString = value.implants.join('\n');
      }
      
      let weaponsArray :Array<Weapon> = new Array
      this.currentCharacter.weapons.forEach(weapon => {
          weaponsArray.push(Object.assign(new Weapon, weapon))
      });
      this.currentCharacter.weapons = weaponsArray

    })
    
    this.battlerHandler.$Target.subscribe((value :ScuffCharacter | DndtCharacter | null) => {
      this.target = value
    })

    this.battlerHandler.$LastAttackDetails.subscribe((value :any) => {
      this.attackInformation = value;
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

  async attack(weapon :Weapon, event? :MouseEvent) {
    const isShiftDown = !!event && event.shiftKey;

    let advantage = 0;
    let damage = null;
    let rollToHit = 0;

    if(isShiftDown) {
      this.battlerHandler.switchCustomAttackInput();

      const customAttackInformation = await this.battlerHandler.waitForCustomAttackData();
      
      damage = customAttackInformation.damage;
      advantage = customAttackInformation.advantage;
      rollToHit = customAttackInformation.rollToHit; 
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
