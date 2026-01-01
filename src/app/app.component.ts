import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Components
import { CharacterSelectionComponent } from './components/character-selection/character-selection.component';
import { CharacterComponent } from './components/character/character.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { DndntCharacterComponent } from './components/dndnt-character/dndnt-character.component';
import { ScuffCharacterBattleViewComponent } from './components/scuff-character-battle-view/scuff-character-battle-view.component';

//Services
import { CharacterHandlerService } from './services/character-handler.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CharacterSelectionComponent,
    CharacterComponent,
    ToolboxComponent,
    DndntCharacterComponent,
    ScuffCharacterBattleViewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  constructor(private characterHandler: CharacterHandlerService ) {}
  
  ngOnInit() {
    //Code executed upon componen initialization 
    this.characterHandler.$CurrentCharacter.subscribe((content) => {
      this.currentCharacter = content;
      this.typeToBeDisplayed = this.currentCharacter.type;
    }); //subscribing to the current character
  }
  
  currentCharacter :any = {}; 

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

