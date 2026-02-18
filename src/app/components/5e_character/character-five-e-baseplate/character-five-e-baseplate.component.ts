//Angular imports
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../../services/character-handler.service';
import { Character5e } from '../../../class/character-5e';

//Components imports
import { CharacterFiveEMainComponent } from '../character-five-e-main/character-five-e-main.component';
import { CharacterFiveEBackgroundComponent } from '../character-five-e-background/character-five-e-background.component';
import { CharacerFiveESpellsComponent } from '../characer-five-e-spells/characer-five-e-spells.component';

@Component({
  selector: 'app-character-five-e-baseplate',
  imports: [
    FormsModule, 
    CharacterFiveEMainComponent, 
    CharacterFiveEBackgroundComponent,
    CharacerFiveESpellsComponent
  ],
  templateUrl: './character-five-e-baseplate.component.html',
  styleUrl: './character-five-e-baseplate.component.css'
})
export class CharacterFiveEBaseplateComponent {

constructor (private characterHandler: CharacterHandlerService) {}

currentCharacter :Character5e = new Character5e;

whatIsDisplayed :string = "all";

ngOnInit() {

  this.characterHandler.$CurrentCharacter.subscribe((value :Character5e) => {
    this.currentCharacter = value;
  })



}



}
