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

  //
  currentCharacter :MaidClass = new MaidClass;

  stressChange :number = 0;

  specialQualities :string = "";
  maidTypes :string = "";
  notes :string = "";
  weapons :string = "";
  personality :string = "";
  backstory :string = "";

  appearanceUrl :string = '';

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :MaidClass) => {

      this.currentCharacter = value;

      const parserOutput = this.characterHandler.characterParser(value);

      if (parserOutput instanceof MaidClass) {
        this.currentCharacter = parserOutput
      }

      const tempStrings = this.currentCharacter.parseToString();

      this.specialQualities = tempStrings.specialQualitiesString;
      this.maidTypes = tempStrings.maidTypesString;
      this.notes = tempStrings.notesString;
      this.weapons = tempStrings.weaponsString;
      this.personality = tempStrings.personalityString;
      this.backstory = tempStrings.backStoryString;

      const data = JSON.parse(localStorage.getItem(value.name) || '{}');
      if (data.appearanceBase64) {
        this.appearanceUrl = data.appearanceBase64; // Base64 data URLs work directly in img src
        this.currentCharacter.appearanceBase64 = data.appearanceBase64;
      }
      })
  }

  savechanges() :void {
    const maidArrays :StringifiedMaidArrays = {
      specialQualitiesString: this.specialQualities,
      maidTypesString: this.maidTypes,
      notesString: this.notes,
      weaponsString: this.weapons,
      personalityString: this.personality,
      backStoryString: this.backstory
    }

    this.currentCharacter.parseFromString(maidArrays);

    this.characterHandler.modifyArray(this.characterHandler.CurrentCharacterId, this.currentCharacter);

    const characterData = {
      ...this.currentCharacter,
      characterAppearance: undefined, // Don't save the File object
      appearanceBase64: this.currentCharacter.appearanceBase64
    };
    localStorage.setItem(this.currentCharacter.name, JSON.stringify(characterData));

    this.characterHandler.saveContent();
  }

  changeCurrentStress() :void {
    this.currentCharacter.changeStress(this.stressChange)
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.savechanges();
    this.characterHandler.getCampaings();
  }

   onAppearanceChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        if (this.appearanceUrl) {
          URL.revokeObjectURL(this.appearanceUrl);
        }

        this.appearanceUrl = URL.createObjectURL(file);
        this.currentCharacter.characterAppearance = file;

        // Convert file to Base64 for localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          this.currentCharacter.appearanceBase64 = base64String;
          this.savechanges();
        };
        reader.readAsDataURL(file);
      }
    }


    ngOnDestroy(): void {
      // Clean up the blob URL when the component is destroyed
      if (this.appearanceUrl) {
        URL.revokeObjectURL(this.appearanceUrl);
      }
    }

}
