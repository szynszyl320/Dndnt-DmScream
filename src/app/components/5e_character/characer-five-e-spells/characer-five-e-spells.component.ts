import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../../services/character-handler.service';
import { Character5e } from '../../../class/character-5e';
import { Spell5e } from '../../../class/spell-5e';


@Component({
  selector: 'app-characer-five-e-spells',
  imports: [FormsModule],
  templateUrl: './characer-five-e-spells.component.html',
  styleUrl: './characer-five-e-spells.component.css'
})

export class CharacerFiveESpellsComponent {
  constructor(private characterHandler: CharacterHandlerService) {}

  currentCharacter :Character5e = new Character5e;

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :Character5e) => {
      this.currentCharacter = value;
    })

  }

 addSpell(spellLevel: number): void {
  const spellArrays: { [key: number]: Spell5e[] } = {
    0: this.currentCharacter.cantrips,
    1: this.currentCharacter.lvl1Spells,
    2: this.currentCharacter.lvl2Spells,
    3: this.currentCharacter.lvl3Spells,
    4: this.currentCharacter.lvl4Spells,
    5: this.currentCharacter.lvl5Spells,
    6: this.currentCharacter.lvl6Spells,
    7: this.currentCharacter.lvl7Spells,
    8: this.currentCharacter.lvl8Spells,
    9: this.currentCharacter.lvl9Spells,
  };

  const targetArray = spellArrays[spellLevel];
  
  if (targetArray) {
    targetArray.push(new Spell5e(spellLevel));
  }

  this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);
  this.characterHandler.saveContent();
}

removeSpell(spellLevel :number, spellIndex :number) :void {
  const spellArrays: { [key: number]: Spell5e[] } = {
    0: this.currentCharacter.cantrips,
    1: this.currentCharacter.lvl1Spells,
    2: this.currentCharacter.lvl2Spells,
    3: this.currentCharacter.lvl3Spells,
    4: this.currentCharacter.lvl4Spells,
    5: this.currentCharacter.lvl5Spells,
    6: this.currentCharacter.lvl6Spells,
    7: this.currentCharacter.lvl7Spells,
    8: this.currentCharacter.lvl8Spells,
    9: this.currentCharacter.lvl9Spells,
  };

  const targetArray = spellArrays[spellLevel];
  
  if (targetArray) {
    targetArray.splice(spellIndex, 1);
  }

  this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);
  this.characterHandler.saveContent();
}

openSpell(event :MouseEvent, spell :Spell5e) {
  if(!event.shiftKey) {
    return;
  }

  let a = document.createElement('a');
  a.href = spell.link;
  a.target = "_blank"
  document.body.appendChild(a);
  a.click();
  a.remove();
}


@HostListener('input', ['$event'])
onAnyInput(_: Event) {
  this.characterHandler.modifyArray(this.characterHandler.findCharacterIndex(this.currentCharacter), this.currentCharacter);
  this.characterHandler.saveContent();
  this.characterHandler.changeCharacter(this.currentCharacter)
}

}
