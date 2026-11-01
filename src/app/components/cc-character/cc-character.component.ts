import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

//service imports
import { CharacterHandlerService } from '../../services/character-handler.service';

import { CallOfCuthulu, stringifiedData, CCweapon, fellowInvestigator } from '../../class/call-of-cuthulu';

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
    assets: ""
  };

  constructor(private characterHandler :CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value :CallOfCuthulu) => {

        const parserOutput = this.characterHandler.characterParser(value);

        if (parserOutput instanceof CallOfCuthulu) {
          this.currentCharacter = parserOutput
        }
        this.stringifiedStats = value.stringifyData();
    })


  }

  Math = Math

  addWeapon() :void {
    this.currentCharacter.weapons.push(new CCweapon);

    this.saveChanges();
  }

  removeWeapon(weaponIndex :number) :void {
    this.currentCharacter.weapons.splice(weaponIndex, 1);

    this.saveChanges();
  }

  addFellowInvestigator() :void {
    const fellowInv :fellowInvestigator = {
      name: "",
      player: ""
    }

    this.currentCharacter.fellowInvestigators.push(fellowInv);
    this.saveChanges()
  }

  removeFellowInvestigator(index :number) {
    this.currentCharacter.fellowInvestigators.splice(index, 1);
    this.saveChanges();
  }

  saveChanges() :void {
    this.currentCharacter.deStringifyData(this.stringifiedStats);

    this.characterHandler.modifyArray(this.characterHandler.CurrentCharacterId, this.currentCharacter)

    this.characterHandler.saveContent();
  }

  @HostListener('input', ['$event'])
  onAnyInput(_: Event) {
    this.saveChanges();
    this.characterHandler.getCampaings();
  }

}
