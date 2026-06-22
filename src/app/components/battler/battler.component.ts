import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BattlerHandlerService } from '../../services/battler-handler.service';
import { CharacterHandlerService } from '../../services/character-handler.service';
import { TurnHandlerService } from '../../services/turn-handler.service';

import { ScuffCharacter } from '../../class/scuff-character';
import { DndtCharacter } from '../../class/dndt-character';
import { Character5e } from '../../class/character-5e';

import { DndntCharacterBattleViewComponent } from '../dndnt-character-battle-view/dndnt-character-battle-view.component';
import { ScuffCharacterBattleViewComponent } from '../scuff-character-battle-view/scuff-character-battle-view.component';
import { CharacterFiveEBattleViewComponent } from '../5e_character/character-five-e-battle-view/character-five-e-battle-view.component';

@Component({
  selector: 'app-battler',
  imports: [
    DndntCharacterBattleViewComponent,
    ScuffCharacterBattleViewComponent,
    CharacterFiveEBattleViewComponent,
    FormsModule
  ],
  templateUrl: './battler.component.html',
  styleUrl: './battler.component.css'
})

export class BattlerComponent {

  
  constructor(
    private battleHandler: BattlerHandlerService, 
    private characterHandler :CharacterHandlerService,
    private turnHandler: TurnHandlerService
  ) {} //Instatniates the battlerhandler and characterHandler serivce 

  Battler :any = {};
  displayedCharacter :ScuffCharacter | DndtCharacter | Character5e = new Character5e
  selectedTarget: ScuffCharacter | DndtCharacter | Character5e | null = null;

  isAttackInfoDisplayed :boolean = false;
  lastAttackInfo :any = false;

  //Code executed on initiation of the component
  ngOnInit() {
    this.battleHandler.$Battler.subscribe((value: any) => {      
      this.Battler = value;
    });  
    
    this.characterHandler.$CurrentCharacter.subscribe((value) => {
        this.displayedCharacter = value;
    }) //subscribes to the Current Character
  
    this.battleHandler.$DisplayAttackInformation.subscribe((value :boolean) => {
      this.isAttackInfoDisplayed = value
    })

    this.battleHandler.$LastAttackDetails.subscribe((value :any) => {
      this.lastAttackInfo = value;
    })

    this.displayedCharacter = this.characterHandler.characterParser(this.displayedCharacter)

  } 

  switchCharacter(character :ScuffCharacter | DndtCharacter | Character5e, event? :MouseEvent) :void {
    const isShiftDown = !!event && event.shiftKey;

    character = this.characterHandler.characterParser(character)

    if(isShiftDown) {
      if(this.selectedTarget && this.selectedTarget.name == character.name) {
        this.selectedTarget = null;
        this.battleHandler.selectNewTarget(null)
        console.log('target deselected');
      } else {
        this.selectedTarget = character;
        this.battleHandler.selectNewTarget(character)
        console.log('target selected', character);
      }
    } else {
      this.characterHandler.changeCharacter(character); 
      this.displayedCharacter = this.characterHandler.characterParser(this.displayedCharacter)
    }
  }

  isSelectedTarget(character: ScuffCharacter | DndtCharacter | Character5e): boolean {
    return this.selectedTarget?.name === character.name;
  }
  
  rerollInitiative() :void {
    let characterToModify :ScuffCharacter | DndtCharacter | Character5e = this.displayedCharacter 
    characterToModify.initiative = Math.floor((Math.random()*20)+1)+Math.floor((characterToModify.dex-10)/2)
    
    this.battleHandler.modifyCharacter(characterToModify, this.battleHandler.getCharacterIndex(characterToModify.name))

    this.battleHandler.sortArray()

    this.battleHandler.saveContent()
  }

  removeCharacter() :void {
    this.battleHandler.removeCharacter(this.battleHandler.getCharacterIndex(this.displayedCharacter.name));

    this.characterHandler.changeCharacter(this.Battler.characters[this.Battler.characters.length-1])

    this.battleHandler.saveContent();
  }

  processTurn() :void {
    if(this.displayedCharacter instanceof ScuffCharacter) {
      this.turnHandler.processTurnStatus(this.displayedCharacter)
      for (let index = 0; index < this.displayedCharacter.statuses.length; index++) {
        if(this.displayedCharacter.statuses[index].doesLower) {
          this.displayedCharacter.statuses[index].stacks --
        }
        if(this.displayedCharacter.statuses[index].stacks < 1) {
          this.displayedCharacter.statuses.splice(index, 1)
        }

      }
        
      this.battleHandler.modifyCharacter(this.displayedCharacter, this.battleHandler.getCharacterIndex(this.displayedCharacter.name))
      
      this.battleHandler.saveContent();   

      this.characterHandler.changeCharacter(this.displayedCharacter)
        
    }
  }

  
  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.battleHandler.modifyCharacter(this.displayedCharacter, this.battleHandler.getCharacterIndex(this.displayedCharacter.name))
    this.battleHandler.sortArray()
    this.battleHandler.saveContent();
  }
}

