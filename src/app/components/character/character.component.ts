//Angular imports
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';

//pipe imports
import { ModifierCeilPipe } from '../../pipes/modifier-ceil.pipe';

//class imports
import { Weapon } from '../../class/weapon';


@Component({
  selector: 'app-character',
  imports: [FormsModule, ModifierCeilPipe],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})


export class CharacterComponent {
  currentCharacter :any = {}; //defines a variable for the current character

  hpChange :number = 0; //defines the variable for later use in changing hp. 

  //strings defined for use in cases where the data is saved as arrays.
  traitsString :string = "";
  langaugesString :string = "";
  proficienciesString :string = '';
  clothesString :string = "";
  implantsString :string = "";
  inventoryString :string = "";
  componentsString :string = "";

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    //Script running upon initiation of the component 
    
    this.characterHandler.$CurrentCharacter.subscribe((value: any) => {  
    
      this.currentCharacter = value; //subscribes to the current character
    
      //all  the arrays get joined to be displayed as strings 
      this.traitsString = value.traits.join('\n') || "";
      this.proficienciesString = value.proficiencies.join('\n') || "";
      this.clothesString = value.clothes.join('\n') || "";
      this.implantsString = value.implants.join('\n') || "";
      this.inventoryString = value.inventory.join('\n') || "";
      this.componentsString = value.components.join('\n') || "";
      this.langaugesString = value.languaues.join('\n') || "";

    }); 
  }

  saveChanges() :void {

    //all the strings get split back up to arrays 
    this.currentCharacter.traits = this.traitsString.split('\n');
    this.currentCharacter.languages = this.langaugesString.split('\n');
    this.currentCharacter.proficiencies = this.proficienciesString.split('\n');
    this.currentCharacter.clothes = this.clothesString.split('\n');
    this.currentCharacter.implants = this.implantsString.split('\n');
    this.currentCharacter.inventory = this.inventoryString.split('\n');
    this.currentCharacter.components = this.componentsString.split('\n');


    this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter); //the current character gets modified 
    
    this.characterHandler.saveContent(); //all the changes get saved to localstorage
  }

  changeCurrentHp() :void {
    //A function that adds the passed numbers to the current hp of the character, saves some time on calculations 
    this.currentCharacter.currentHp += this.hpChange;
    this.hpChange = 0;
  }

  addWeapon() :void {
    this.currentCharacter.weapons.push(new Weapon) //pushes a new weapon into the weapon array
    this.saveChanges(); 
  }

  removeWeapon(weaponIndex :number) :void {
    this.currentCharacter.weapons.splice(weaponIndex, 1); //deletes the desired weapon from the array
    this.saveChanges();
  }

  //Listener that triggers the function saveChanges anytime an input gets modified in any way. 
  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
  }
 
}
