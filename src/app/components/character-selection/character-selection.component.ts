import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterHandlerService } from '../../services/character-handler.service';
import { ScuffCharacter } from '../../class/scuff-character';
import { DndtCharacter } from '../../class/dndt-character';
import { Character5e } from '../../class/character-5e';


@Component({
  selector: 'app-character-selection',
  imports: [FormsModule],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.css'
})

export class CharacterSelectionComponent {
  campaigns :Set<string> = new Set<string>;

  CharactersArray: any = [];
  
  isCreatorVisible :boolean = false;

  collapsed: { [campaign: string]: boolean } = {};

  searchTerm :string = '';

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    this.characterHandler.$CharacterList.subscribe((value: any) => {  
      this.CharactersArray = value;
    }); 
   
    this.characterHandler.$Campaigns.subscribe((value :any) => {
      this.campaigns = value;
      (this.campaigns || []).forEach(c => this.collapsed[c] = false);
    })
    
  }

  chooseCharacter(character :ScuffCharacter | any) :void {
    try {
      this.characterHandler.changeCharacter(character);
      this.characterHandler.saveContent();
      console.log(character);
    } catch (error) {
      console.error("Something went wrong when changing character", error); 
    }
  }

  createNewCharacter(type :string) :void {
    try {
      let newCharacter :any;
      if (type == "generation") {
        newCharacter = new ScuffCharacter;
      } else if(type == "dndnt") {
        newCharacter = new DndtCharacter;
      } else if(type == "5e") {
        newCharacter = new Character5e;
      }
      this.characterHandler.createNewCharacter(newCharacter);
      this.characterHandler.getCampaings();   
      this.characterHandler.saveContent();
    } catch (error) {
      console.error("Something went wrong when creating the character", error);
    }
  }
  
  toggleCampaign(campaign: string) {
    this.collapsed[campaign] = !this.collapsed[campaign];
  }
  
  filterCharacters(campaign: string): any[] {
    if (!this.searchTerm.trim()) {
      return this.CharactersArray.filter((c: any) => c.campaign === campaign);
    }
    return this.CharactersArray.filter((c: any) => 
      c.campaign === campaign && 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}


