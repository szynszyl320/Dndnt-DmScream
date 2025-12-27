import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CharacterHandlerService } from '../../services/character-handler.service';

@Component({
  selector: 'app-toolbox',
  imports: [FormsModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {

  currentCharacter :any = {};
  characterArray :Array<any> = [];

  dice :Array<number> = [
    4, 6, 8, 10, 12, 20, 100
  ]

  diceToRoll :Array<number> = [];

  scores :string = "";

  isToolboxVisible :boolean = false;

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {
    this.characterHandler.$CurrentCharacter.subscribe((value: any) => {      
        this.currentCharacter = value;
    });
    this.characterHandler.$CharacterList.subscribe((value: any) => {
      this.characterArray = value;
    })
  }

  exportCurrentCharacter() :void {
    try {
      const json = JSON.stringify(this.currentCharacter ?? {}, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8'});
      
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${this.currentCharacter.name}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('An error occured while exporting the character', error);
    }
  }

  importCharacter(event :any) :void {
    try {
      
      let newCharacterFile :any = event.target.files[0];

      const Reader = new FileReader();
      Reader.onload = () => {
        let newCharacter = JSON.parse(Reader.result as string);
      
        this.characterHandler.createNewCharacter(newCharacter);
      };
      
      Reader.readAsText(newCharacterFile);
      
      alert("Character sucessfully imported!")
      event.target.value = null;
    } catch (error) {
      console.error("Error importing file: ", error);
    }
  }


  deleteCurrentCharacter() :void {

    if(confirm(`Are you sure you want to delete ${this.currentCharacter.name} of the ${this.currentCharacter.campaign}?`)) {
      this.characterHandler.deleteCharacter(this.characterHandler.findCharacterIndex(this.currentCharacter));
      this.characterHandler.changeCharacter(this.characterArray[0])
      this.characterHandler.saveContent();
    }

  }

  pushDice(diceNumber :number, event?: MouseEvent) :void {
    const shift = !!event && event.shiftKey;
    if(shift) {
      
      this.diceToRoll.push(diceNumber);  
    
    } else {
    
      this.scores = `D${diceNumber} = ${Math.floor(Math.random()*diceNumber) +1}`;
    
    }

  }

  rollTheDice() :void {
    let ticker = 0;
    this.scores = "";
    this.diceToRoll.forEach(die => {
      let score = Math.floor(Math.random()*die) +1
      this.scores += `${score}, `;
      ticker += score;
    });
    this.scores += `   The combined score is: ${ticker}`;
  }

  clearTheDice() :void {
    this.diceToRoll = [];
    this.scores = "";
  }

}
