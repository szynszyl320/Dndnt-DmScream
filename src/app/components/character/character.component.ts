import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CharacterHandlerService } from '../../services/character-handler.service';

import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';
import { Weapon } from '../../class/weapon';


@Component({
  selector: 'app-character',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})


export class CharacterComponent {
  currentCharacter :any;

  hpChange :number = 0;

  traitsString :string = "";
  langaugesString :string = "";
  proficienciesString :string = '';
  clothesString :string = "";
  implantsString :string = "";
  inventoryString :string = "";
  componentsString :string = "";

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value: any) => {  
    
      this.currentCharacter = value;
    
      this.traitsString = value.traits.join('\n') || "";
      this.proficienciesString = value.proficiencies.join('\n') || "";
      this.clothesString = value.clothes.join('\n') || "";
      this.implantsString = value.implants.join('\n') || "";
      this.inventoryString = value.inventory.join('\n') || "";
      this.componentsString = value.components.join('\n') || "";
      this.langaugesString = value.languagues.join('\n') || "";

    }); 
  }

  saveChanges() :void {

    this.currentCharacter.traits = this.traitsString.split('\n');
    this.currentCharacter.languagues = this.langaugesString.split('\n');
    this.currentCharacter.proficiencies = this.proficienciesString.split('\n');
    this.currentCharacter.clothes = this.clothesString.split('\n');
    this.currentCharacter.implants = this.implantsString.split('\n');
    this.currentCharacter.inventory = this.inventoryString.split('\n');
    this.currentCharacter.components = this.componentsString.split('\n');

    this.characterHandler.changeCharacter(this.currentCharacter);
    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);
    this.characterHandler.saveContent();
  }

  changeCurrentHp() :void {
    this.currentCharacter.currentHp += this.hpChange;
    this.hpChange = 0;
  }

  addWeapon() :void {
    this.currentCharacter.weapons.push(new Weapon)
  }

  removeWeapon(weaponIndex :number) :void {
    this.currentCharacter.weapons.splice(weaponIndex, 1);
    this.saveChanges();
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
  }
 
}
