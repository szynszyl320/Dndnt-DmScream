import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScuffCharacter } from '../class/scuff-character';

@Injectable({
  providedIn: 'root'
})

export class CharacterHandlerService {

  $CurrentCharacter :BehaviorSubject<any> = new BehaviorSubject<any>(null); //Defining the Current Character Subject for Observables  
  $CharacterList :BehaviorSubject<any> = new BehaviorSubject<any>(null); //Defining the Array of characters Subject for Observables 
  $Campaigns :BehaviorSubject<any> = new BehaviorSubject<any>(null); //Defining a set of campaings for observables

  constructor() {
    //Automatically loads the content saved in localStorage 
    this.loadContent();

  }


  loadContent() :any {
    try {
      
      
      //Loads and Parses the content from localStorage. If it doesn't find anything, inserts arbitrary values so the program doesn't shit itself 
      let localMainsave = localStorage.getItem('dndnt_main'); 
      let MainSave :any; 

      if(localMainsave != null) {
        MainSave = JSON.parse(localMainsave); 
      } else {
        MainSave = {
          CurrentCharacter: new ScuffCharacter,
          CharacterList: [new ScuffCharacter]
        }
      }

      const initial = MainSave.CurrentCharacter ||  MainSave.CharacterList[0] || null; // creates a constant with the for the loaded Current Character, if not found, chooses the first character in the Character Array, if none are found, it just inserts a null value. 
      this.$CurrentCharacter = new BehaviorSubject<any>(initial); // Creates a new Subject with the initial value 
      this.$CharacterList = new BehaviorSubject<any>(MainSave.CharacterList || null); //Creates a new Subject with the CharacterList or a null value; 

      this.getCampaings();

      console.log("Content succesfully loaded");

    } catch (error) {
      
      //Inserting arbitrary values so the program doesn't shit itself 
      this.$CurrentCharacter.next(new ScuffCharacter);
      this.$CharacterList.next([new ScuffCharacter]);

      console.error("Error loading content: ", error);

    }
  }

  saveContent() :void {
    try {
      const MainSave :any = {
        CurrentCharacter: this.$CurrentCharacter.getValue(),
        CharacterList: this.$CharacterList.getValue(),
      }; //creates a new MainSave wit the value of Current Character and CharacterList 
      localStorage.setItem('dndnt_main', JSON.stringify(MainSave)); //saves the MainSave to localstorage, after stringifying it 
    
    } catch (error) {
      console.error("Error saving content: ", error);
    }

  }

  changeCharacter(newChosenCharacter :ScuffCharacter | any) :void {
    try {
      if(newChosenCharacter != null) {
      this.$CurrentCharacter.next(newChosenCharacter); //changes the current character by inserting a new value into the $CurrentCharacter Subject
    } else {
      return;
    }
    } catch (error) {
      console.error('Error changing character: ', error);
    }
  }

  modifyArray(characterIndex :number | any, character :any ) :void {
    try {
      const characters :Array<any> = this.$CharacterList.getValue(); //Creates a temporary array based on the $CharacterList Subject's value 
      characters[characterIndex] = character; //Modifies the desired character in the temporary array 
      this.$CharacterList.next(characters); //Replaces the current CharacterList with the modified data
    } catch (error) {
      console.error('Error updating character list: ', error);
    }
  }

  findCharacterIndex(character : ScuffCharacter | any) :number {
    try {
      const characters :Array<any> = this.$CharacterList.getValue(); //gets the value of the $CharacterList arraty
    for(let i = 0; i < characters.length; i++) {
        if(characters[i].name == character.name && characters[i].campaign == character.campaign) {
          //Checks if a character with the provided name and campaign exists. I'm aware this is not fool proof, I simply decided not to introduce an Id system. If it comes back to bite me in the ass later on, I'll come back to modify this comment 
          return i; //returns the index in the $CharacterList Subject 
        }
      }
      return NaN; //if the given character isn't found, returns a Not a Number, essentially bricking whatever it is later in the code 
    } catch (error) {
      console.error('Error finding character: ', error);
      return NaN;
    }
  }

  createNewCharacter(newCharacter :ScuffCharacter | any) :void {
    if(newCharacter != null) {
      const characters :Array<any> = this.$CharacterList.getValue(); //Creates a temporary array based on the $CharacterList Subject's value 
      characters.push(newCharacter); //Pushes the new character into the temporary array
      this.$CharacterList.next(characters); //Replaces the current CharacterList with the modified data
    } else {
      console.error('Failed to provide a correct character');
      return;
    }
  }

  deleteCharacter(characterIndex :number) :void {
    if(characterIndex > -1 && characterIndex < this.$CharacterList.getValue().length) {
      //checks if the index isn't small than -1 and bigger than the current array size
      const characters :Array<any> = this.$CharacterList.getValue(); //Creates a temporary array based on the $CharacterList Subject's value
      characters.splice(characterIndex, 1); //Deletes the character with the provided index from the Array
      this.$CharacterList.next(characters); //Replaces the current CharacterList with the modified data
    } else {
      return;
    }
  }

  getCampaings() :void {
    try {
      const campaings = new Set<string>
      this.$CharacterList.getValue().forEach((character :any ) => {
        campaings.add(character.campaign)
      });
      this.$Campaigns.next(campaings);
    } catch (error) {
      console.error("Error trying to isolate campaigns: ", error);
    }
  }
}
