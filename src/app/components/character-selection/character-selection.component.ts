import { Component} from '@angular/core';
import { CharacterHandlerService } from '../../services/character-handler.service';
import { ScuffCharacter } from '../../class/scuff-character';
import { DndtCharacter } from '../../class/dndt-character';

@Component({
  selector: 'app-character-selection',
  imports: [],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.css'
})

export class CharacterSelectionComponent {
  campaigns :Set<string> = new Set<string>;

  CharactersArray: any = [];
  
  isCreatorVisible :boolean = false;

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    this.characterHandler.$CharacterList.subscribe((value: any) => {  
      this.CharactersArray = value;
    }); 
   
    this.characterHandler.$Campaigns.subscribe((value :any) => {
      this.campaigns = value;
    })
  }

  chooseCharacter(character :ScuffCharacter | any) :void {
    try {
      this.characterHandler.changeCharacter(character);
      this.characterHandler.saveContent();
    } catch (error) {
      console.error("Something went wrong when changing character", error); 
    }
  }

  createNewCharacter(type :string) :void {
    try {
      let newCharacter :any;
      if (type == "generation") {
        newCharacter = new ScuffCharacter;
      } else if(type = "dndt") {
        newCharacter = new DndtCharacter;
      }
      this.characterHandler.createNewCharacter(newCharacter);
      this.characterHandler.saveContent();
    } catch (error) {
      console.error("Something went wrong when creating the character", error);
    }
  }

  

}


