import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CharacterHandlerService } from '../../services/character-handler.service';

import { MaidClass, StringifiedMaidArrays } from '../../class/maid-class';

@Component({
  selector: 'app-maid-character',
  imports: [FormsModule],
  templateUrl: './maid-character.component.html',
  styleUrl: './maid-character.component.css'
})
export class MaidCharacterComponent {

  currentCharacter :MaidClass = new MaidClass;

  stressChange :number = 0;

  specialQualities :string = "";
  maidTypes :string = "";
  notes :string = "";
  weapons :string = "";
  appearance :string = "";
  personality :string = "";

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :MaidClass) => {

      this.currentCharacter = value;

      const tempStrings = value.parseToString();

      this.specialQualities = tempStrings.specialQualitiesString;
      this.maidTypes = tempStrings.maidTypesString;
      this.notes = tempStrings.notesString;
      this.weapons = tempStrings.weaponsString;
      this.appearance = tempStrings.appearnaceString;
      this.personality = tempStrings.personalityString;

    })
  }

  savechanges() :void {
    const maidArrays :StringifiedMaidArrays = {
      specialQualitiesString: this.specialQualities,
      maidTypesString: this.maidTypes,
      notesString: this.notes,
      weaponsString: this.weapons,
      appearnaceString: this.appearance,
      personalityString: this.personality
    }

    this.currentCharacter.parseFromString(maidArrays);

    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);

    this.characterHandler.saveContent();
  }

  changeCurrentStress() :void {
    this.currentCharacter.changeStress(this.stressChange);
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.savechanges();
    this.characterHandler.getCampaings();
  }


}
