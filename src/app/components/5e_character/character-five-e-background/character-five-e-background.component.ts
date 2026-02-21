import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../../services/character-handler.service';
import { Character5e } from '../../../class/character-5e';


@Component({
  selector: 'app-character-five-e-background',
  imports: [FormsModule],
  templateUrl: './character-five-e-background.component.html',
  styleUrl: './character-five-e-background.component.css',

})
export class CharacterFiveEBackgroundComponent {

URL = URL;

constructor (private characterHandler: CharacterHandlerService) {}

currentCharacter :Character5e = new Character5e;
alliesAndOrganisationsString :string = "";
additionalFeaturesAndTraitsString :string = "";
magicItemsString :string = "";

appearanceUrl :string = '';

ngOnInit() {
  this.characterHandler.$CurrentCharacter.subscribe((value :Character5e) => {
    this.currentCharacter = value;
  
    this.alliesAndOrganisationsString = value.alliesAndOrganisations.join('\n');
    this.additionalFeaturesAndTraitsString = value.additionalFeaturesAndTraits.join('\n')
    this.magicItemsString = value.magicItems.join('\n');

    const data = JSON.parse(localStorage.getItem(value.name) || '{}');
    if (data.appearanceBase64) {
      this.appearanceUrl = data.appearanceBase64; // Base64 data URLs work directly in img src
      this.currentCharacter.appearanceBase64 = data.appearanceBase64;
    }
    
  })

}

saveChanges() :void {
  //all the strings get split back up to arrays 
    this.currentCharacter.alliesAndOrganisations = this.alliesAndOrganisationsString.split('\n');
    this.currentCharacter.additionalFeaturesAndTraits = this.additionalFeaturesAndTraitsString.split('\n');
    this.currentCharacter.magicItems = this.magicItemsString.split('\n');

    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter); //the current character gets modified 
  
    const characterData = {
      ...this.currentCharacter,
      characterAppearance: undefined, // Don't save the File object
      appearanceBase64: this.currentCharacter.appearanceBase64
    };
    localStorage.setItem(this.currentCharacter.name, JSON.stringify(characterData));

    this.characterHandler.saveContent(); //all the changes get saved to localstorage
  }

//Listener that triggers the function saveChanges anytime an input gets modified in any way. 
@HostListener('input', ['$event'])
onAnyInput(_: Event) {
  this.saveChanges();
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
        this.saveChanges();
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
