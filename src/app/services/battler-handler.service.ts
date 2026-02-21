import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CharacterHandlerService } from './character-handler.service';

import { ScuffCharacter } from '../class/scuff-character';
import { Character5e } from '../class/character-5e';
import { DndtCharacter } from '../class/dndt-character';


@Injectable({
  providedIn: 'root'
})

export class BattlerHandlerService {

  $Battler :BehaviorSubject<any> = new BehaviorSubject<any>(null)
  $Target :BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private characterHandler : CharacterHandlerService) {
    this.loadcontent() 
    this.sortArray()  
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

  selectNewTarget(character :ScuffCharacter | null) :void {
    try { 
      this.$Target.next(character);
    } catch (error) {
      console.error('Failed to target the character')
    }
  }

}
