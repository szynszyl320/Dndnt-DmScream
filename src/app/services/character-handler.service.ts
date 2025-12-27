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
    this.loadContent();

  }

  loadContent() :any {
    try {
      const MainSave :any = JSON.parse(localStorage.getItem('dndnt_main') || '{}');
      
      const initial = MainSave.CurrentCharacter ||  MainSave.CharacterList[0] || null;
      this.$CurrentCharacter = new BehaviorSubject<any>(initial);

      this.$CharacterList = new BehaviorSubject<any>(MainSave.CharacterList);
    
      console.log("Content succesfully loaded");

    } catch (error) {
      
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
