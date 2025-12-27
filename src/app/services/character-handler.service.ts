import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScuffCharacter } from '../class/scuff-character';

@Injectable({
  providedIn: 'root'
})
export class CharacterHandlerService {

  $CurrentCharacter :BehaviorSubject<any> = new BehaviorSubject<any>(null);
  $CharacterList :BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    // localStorage.setItem('dndnt_main', "{CurrentCharacter: {name: test, campaign: test} CharacterList: [{name: test, campaign: test}]}");

    this.loadContent();

  }

  loadContent() :any {
    try {
      const MainSave :any = JSON.parse(localStorage.getItem('dndnt_main') || '{{CurrentCharacter: {name: "test", campaign: "test"} CharacterList: [{name: "test", campaign: "test"}]}}');
      
      const initial = MainSave.CurrentCharacter ||  MainSave.CharacterList[0] || null;
      this.$CurrentCharacter = new BehaviorSubject<any>(initial);

      this.$CharacterList = new BehaviorSubject<any>(MainSave.CharacterList);
    
      console.log("Content succesfully loaded");

    } catch (error) {
      
      this.$CurrentCharacter.next({name: "test", campaign: "test"})
      this.$CharacterList.next([{name: "test", campaign: "test"}])

      console.error("Error loading content: ", error);

    }
  }

  saveContent() :void {
    try {
      const MainSave :any = {
        CurrentCharacter: this.$CurrentCharacter.getValue(),
        CharacterList: this.$CharacterList.getValue(),
      };
      localStorage.setItem('dndnt_main', JSON.stringify(MainSave));
    
    } catch (error) {
      
      console.error("Error saving content: ", error);
      
    }

  }

  changeCharacter(newChosenCharacter :ScuffCharacter | any) :void {
    if(newChosenCharacter != null) {
      this.$CurrentCharacter.next(newChosenCharacter);
    } else {
      return;
    }
  }

  modifyArray(characterIndex :number | any, character :any ) :void {
    try {
      const characters :Array<any> = this.$CharacterList.getValue();
      characters[characterIndex] = character;
      this.$CharacterList.next(characters);
    } catch (error) {
      console.error('Error updating character list: ', error);
    }
  }

  findCharacterIndex(character : ScuffCharacter | any) :number | null {
    const characters :Array<any> = this.$CharacterList.getValue();
    for(let i = 0; i < characters.length; i++) {
      if(characters[i].name == character.name && characters[i].campaign == character.campaign) {
        return i;
      }
    }
    return null;
  }

  createNewCharacter(newCharacter :ScuffCharacter | any) :void {
    if(newCharacter != null) {
      const characters :Array<any> = this.$CharacterList.getValue(); 
      characters.push(newCharacter);
      console.log(characters);
      this.$CharacterList.next(characters);
    } else {
      return;
    }
  }

  deleteCharacter(characterIndex :number) :void {
    if(characterIndex > -1 && characterIndex < this.$CharacterList.getValue().length) {
      const characters :Array<any> = this.$CharacterList.getValue();
      console.log(characters);
      
      characters.splice(characterIndex, 1);
      console.log(characters);
      
      this.$CharacterList.next(characters)
    } else {
      return;
    }
  }

}
