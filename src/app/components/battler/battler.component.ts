import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BattlerHandlerService } from '../../services/battler-handler.service';
import { CharacterHandlerService } from '../../services/character-handler.service';

import { ScuffCharacter } from '../../class/scuff-character';
import { DndtCharacter } from '../../class/dndt-character';
import { Character5e } from '../../class/character-5e';

import { DndntCharacterBattleViewComponent } from '../dndnt-character-battle-view/dndnt-character-battle-view.component';
import { ScuffCharacterBattleViewComponent } from '../scuff-character-battle-view/scuff-character-battle-view.component';

@Component({
  selector: 'app-battler',
  imports: [
    DndntCharacterBattleViewComponent,
    ScuffCharacterBattleViewComponent,
    FormsModule
  ],
  templateUrl: './battler.component.html',
  styleUrl: './battler.component.css'
})

export class BattlerComponent {
  
  constructor(private battleHandler: BattlerHandlerService, private characterHandler :CharacterHandlerService) {} //Instatniates the battlerhandler and characterHandler serivce 

  Battler :any = {};
  displayedCharacter :ScuffCharacter | DndtCharacter | Character5e = new Character5e

  //Code executed on initiation of the component
  ngOnInit() {
    this.battleHandler.$Battler.subscribe((value: any) => {      
      this.Battler = value;
      
    });  
    
    this.characterHandler.$CurrentCharacter.subscribe((value) => {
      this.displayedCharacter = value;
    }) //subscribes to the Current Character
  } 

  switchCharacter(character :ScuffCharacter | DndtCharacter | Character5e, event? :MouseEvent) :void {
    const isShiftDown = !!event && event.shiftKey;

    if(isShiftDown && character.type == 'generation ship') {
      character = Object.assign(new ScuffCharacter, character)
      
      if(character instanceof ScuffCharacter) {
        this.battleHandler.selectNewTarget(character)
      }
      
      console.log('target selected', character);
    } else {
      this.characterHandler.changeCharacter(character); 
      console.log(this.displayedCharacter.currentHp);
       
    }
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

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.battleHandler.modifyCharacter(this.displayedCharacter, this.battleHandler.getCharacterIndex(this.displayedCharacter.name))
    this.battleHandler.sortArray()
    this.battleHandler.saveContent();
  }
}

