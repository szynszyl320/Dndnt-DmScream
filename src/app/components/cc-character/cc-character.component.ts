import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';

import { CallOfCuthulu, stringifiedData, CCweapon } from '../../class/call-of-cuthulu';

@Component({
  selector: 'app-cc-character',
  imports: [FormsModule],
  templateUrl: './cc-character.component.html',
  styleUrl: './cc-character.component.css'
})

export class CcCharacterComponent {
  currentCharacter :CallOfCuthulu = new CallOfCuthulu;
  stringifiedStats :stringifiedData = {
    personalDescription: "",
    idealogyBeliefs: "",
    significantPeople: "",
    traits: "",
    injuriesAndScars: "",
    phobiasAndMainias: "",
    arcaneTomesSpellsAndArtifacts: "",
    meaningfulLocations: "",
    treassuredPossessions: "",
    enccountersWithStrangeEntities: "",
    gearAndPossessions: "",
    spendingLevel: "",
    assets: ""
  };

  constructor(private characterHandler :CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :CallOfCuthulu) => {

        this.currentCharacter = value;

        this.stringifiedStats = value.stringifyData();

    })

  }

  addWeapon() :void {
    this.currentCharacter.weapons.push(new CCweapon);

    this.saveChanges();
  }

  removeWeapon(weaponIndex :number) :void {
    this.currentCharacter.weapons.splice(weaponIndex, 1);

    this.saveChanges();
  }

  saveChanges() :void {
    this.currentCharacter.deStringifyData(this.stringifiedStats);

    this.characterHandler.saveContent();
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
    this.characterHandler.getCampaings();
  }

}
