import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../../services/character-handler.service';
import { Character5e } from '../../../class/character-5e';

//pipe imports
import { Modifier5ePipe } from '../../../pipes/modifier-5e.pipe';
import { Weapon } from '../../../class/weapon';

@Component({
  selector: 'app-character-five-e-main',
  imports: [FormsModule, Modifier5ePipe],
  templateUrl: './character-five-e-main.component.html',
  styleUrl: './character-five-e-main.component.css'
})

export class CharacterFiveEMainComponent {

constructor (private characterHandler: CharacterHandlerService) {}

currentCharacter :Character5e = new Character5e;

personalityTraitsString :string = "";
idealsString :string = "";
bondsString :string = "";
flawsString :string = "";
equipmentString :string = "";
proficienciesString :string = "";
languagesString :string = "";
featuresAndTraitsString :string = "";
otherWeaponsAndAttacksString :string = "";


ngOnInit() {

  this.characterHandler.$CurrentCharacter.subscribe((value :Character5e) => {
    this.currentCharacter = value;
    
    this.personalityTraitsString = value.personalityTraits.join('\n');
    this.idealsString = value.ideals.join('\n');
    this.bondsString = value.bonds.join('\n');
    this.flawsString = value.flaws.join('\n');
    this.equipmentString = value.equipment.join('\n');
    this.proficienciesString = value.proficiencies.join('\n');
    this.featuresAndTraitsString = value.featuresAndTraits.join('\n')
    this.languagesString = value.languages.join('\n');
    this.otherWeaponsAndAttacksString = value.otherWeaponsAndAttacks.join('\n');

  })

}

toggleSave(count: number): void {
    this.currentCharacter.saves = this.currentCharacter.saves === count ? count - 1 : count;
}

toggleFailure(count: number): void {
    this.currentCharacter.failures = this.currentCharacter.failures === count ? count - 1 : count;
}

addNewWeapon() :void {
  this.currentCharacter.weapons.push(new Weapon);
}

removeWeapon(weaponIndex :number) :void {
  this.currentCharacter.weapons.splice(weaponIndex, 1);
}

saveChanges() :void {

    //all the strings get split back up to arrays 
    this.currentCharacter.personalityTraits = this.personalityTraitsString.split('\n');
    this.currentCharacter.ideals = this.idealsString.split('\n');
    this.currentCharacter.bonds = this.bondsString.split('\n');
    this.currentCharacter.flaws = this.flawsString.split('\n');
    this.currentCharacter.equipment = this.equipmentString.split('\n');
    this.currentCharacter.proficiencies = this.proficienciesString.split('\n');
    this.currentCharacter.featuresAndTraits = this.featuresAndTraitsString.split('\n');
    this.currentCharacter.languages = this.languagesString.split('\n');
    this.currentCharacter.otherWeaponsAndAttacks = this.otherWeaponsAndAttacksString.split('\n');
    
  
    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter); //the current character gets modified 
    
    this.characterHandler.saveContent(); //all the changes get saved to localstorage
  }

//Listener that triggers the function saveChanges anytime an input gets modified in any way. 
@HostListener('input', ['$event'])
onAnyInput(_: Event) {
  this.saveChanges();
  this.characterHandler.getCampaings();
}


}
