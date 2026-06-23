//Angular imports
import { Component, NgZone, HostListener, inject } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  private activatedRoute = inject(ActivatedRoute);

  currentCharacter :DndtCharacter = new DndtCharacter;

  target :ScuffCharacter | DndtCharacter | Character5e | null = null

  hpChange :number = 0;
  maxHpChange :number = 0;

  woundsString :string = "";

  isOutputVisible :boolean = false;

  finalScore :string = "";

  attackInformation :any = null;

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :DndtCharacter) => {      

      this.currentCharacter = value;

      if(value.wounds) {
        this.woundsString = value.wounds.join('\n')
      }
      
      let weaponsArray :Array<Weapon> = new Array
      this.currentCharacter.weapons.forEach(weapon => {
          weaponsArray.push(Object.assign(new Weapon, weapon))
      });
      this.currentCharacter.weapons = weaponsArray

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

}
