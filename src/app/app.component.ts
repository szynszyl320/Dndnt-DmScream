import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Components
import { CharacterSelectionComponent } from './components/character-selection/character-selection.component';
import { CharacterComponent } from './components/character/character.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CharacterSelectionComponent,
    CharacterComponent,
    ToolboxComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
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
}

