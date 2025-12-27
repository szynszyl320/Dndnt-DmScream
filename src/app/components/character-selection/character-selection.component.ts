import { Component} from '@angular/core';
import { CharacterHandlerService } from '../../services/character-handler.service';
import { ScuffCharacter } from '../../class/scuff-character';

@Component({
  selector: 'app-character-selection',
  imports: [],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.css'
})

export class CharacterSelectionComponent {
  CharactersArray: any = [];
  
  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    this.characterHandler.$CharacterList.subscribe((value: any) => {  
      this.CharactersArray = value;
    }); 
   
  }

  chooseCharacter(character :ScuffCharacter | any) :void {
    try {
      this.characterHandler.changeCharacter(character);
      this.characterHandler.saveContent();
    } catch (error) {
      console.error("Something went wrong when changing character", error); 
    }
  }

  createNewCharacter() :void {
    try {
      this.characterHandler.createNewCharacter(new ScuffCharacter)
      this.characterHandler.saveContent();
    } catch (error) {
      console.error("Something went wrong when creating the character", error);
    }
  }

}


