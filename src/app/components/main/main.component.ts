import { Component } from '@angular/core';

import { CharacterSelectionComponent } from '../character-selection/character-selection.component';
import { CharacterComponent } from '../character/character.component';
import { ToolboxComponent } from '../toolbox/toolbox.component';
import { DndntCharacterComponent } from '../dndnt-character/dndnt-character.component';
import { ScuffCharacterBattleViewComponent } from '../scuff-character-battle-view/scuff-character-battle-view.component';
import { DndntCharacterBattleViewComponent } from '../dndnt-character-battle-view/dndnt-character-battle-view.component';
import { CharacterFiveEBaseplateComponent } from '../5e_character/character-five-e-baseplate/character-five-e-baseplate.component';

//Services
import { CharacterHandlerService } from '../../services/character-handler.service';

@Component({
  selector: 'app-main',
  imports: [
    CharacterSelectionComponent,
    CharacterComponent,
    ToolboxComponent,
    DndntCharacterComponent,
    ScuffCharacterBattleViewComponent,
    DndntCharacterBattleViewComponent,  
    CharacterFiveEBaseplateComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    this.characterHandler.$CurrentCharacter.subscribe((content) => {
      this.currentCharacter = content;
      this.typeToBeDisplayed = this.currentCharacter.type;
    }); //subscribing to the current character
  }

  currentCharacter :any = {}; 

  showLayout :boolean = true;

  typeToBeDisplayed :string = "";

  isSideBarVisible :boolean = true; //defines a variable for checking if the sidebar is visible 
  leftSectionWidth :string = "90%" //defines a variable with the default width of the right section

  switchSideBar() :void {
    this.isSideBarVisible = !this.isSideBarVisible; //switches the value of the variable to the negation of it's former self 
    if(this.isSideBarVisible) {
      this.leftSectionWidth = "90%";
    } else {
      this.leftSectionWidth = "100%";
    }
    //sets the section width to make it look better
  }

  isToolBoxVisible :boolean = false;

  typeOfView :string = "standard";

}
