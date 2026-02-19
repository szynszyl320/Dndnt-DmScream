//Angular imports
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

//Service imports
import { CharacterHandlerService } from '../../services/character-handler.service';
import { BattlerHandlerService } from '../../services/battler-handler.service';


@Component({
  selector: 'app-toolbox',
  imports: [FormsModule, RouterLink],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})

export class ToolboxComponent {

  currentCharacter :any = {}; //creates a variable for the current character
  characterArray :Array<any> = []; //creates a variable 

  dice :Array<number> = [
    4, 6, 8, 10, 12, 20, 100
  ] //creates an array with all the dice numbers accepted in standard dnd 

  diceToRoll :Array<number> = []; //creates an array for later storing of dice to be rolled

  scores :string = ""; //creates an empty string variable for later scores coming from rolling the dice 

  isToolboxVisible :boolean = false; //creates a variable to check if the toolbox is visible 

  constructor(private characterHandler: CharacterHandlerService, private battlerHandler: BattlerHandlerService) {} //Instatniates the characterHandler and battlerHandler serivce 

  //Code executed on initiation of the component
  ngOnInit() {
    this.characterHandler.$CurrentCharacter.subscribe((value: any) => {      
        this.currentCharacter = value;
    }); //subscribes to the Current Character 
    
    this.characterHandler.$CharacterList.subscribe((value: any) => {
      this.characterArray = value;
    }) //subscribes to the Character list 
  }

  exportCurrentCharacter() :void {
    try {
      const json = JSON.stringify(this.currentCharacter ?? {}, null, 2) //stringifies the current character, if no character is chosen inputs an empty object. 
      const blob = new Blob([json], { type: 'application/json;charset=utf-8'}); //creates a new blob with the json as content 
      
      const a = document.createElement('a'); //creates an 'a' tag 
      a.href = window.URL.createObjectURL(blob); //creates an URl for the newly created blob 
      a.download = `${this.currentCharacter.name}.json`; //creates a name for the downloadable file
      document.body.appendChild(a); //inserts the new tag into the document body
      a.click(); //initiates a click event for the 'a' tag
      a.remove(); //removes the tag

    } catch (error) {
      console.error('An error occured while exporting the character', error);
    }
  }

  importCharacter(event :any) :void {
    try {
      
      let newCharacterFile :any = event.target.files[0]; //reads the file array from the file input 

      const Reader = new FileReader(); //instatiates a new file reader
      Reader.onload = () => {
        //Code to be executed when the asyncronus FileReader loads
        let newCharacter = JSON.parse(Reader.result as string); //parses the read text as a JSON
      
        this.characterHandler.createNewCharacter(newCharacter); //creates a new character based on the JSON
        this.characterHandler.changeCharacter(this.characterArray[this.characterArray.length-1]); //Switches the current character to the one freshly imported 
      };
      
      Reader.readAsText(newCharacterFile); //defiens the behaviour of the FileReader
      
      alert("Character sucessfully imported!"); //gives an indication to the user that the character has been imported.

      this.characterHandler.getCampaings();

      this.characterHandler.saveContent(); //saves content to confirm changes

      event.target.value = null; //clears the file input
    } catch (error) {
      console.error("Error importing file: ", error);
    }
  }


  deleteCurrentCharacter() :void {

    if(confirm(`Are you sure you want to delete ${this.currentCharacter.name} of the ${this.currentCharacter.campaign}?`)) {
      //sends a confirmation to the user if they're sure they want to delete the desired character
   
      this.characterHandler.deleteCharacter(this.characterHandler.findCharacterIndex(this.currentCharacter)); //Deletes the character   
      this.characterHandler.changeCharacter(this.characterArray[0]); //changes the character to the first on in the characterArray
      this.characterHandler.getCampaings();
      this.characterHandler.saveContent(); //saves content to confirm changes;
    }

  }

  pushDice(diceNumber :number, event?: MouseEvent) :void {
    const shift = !!event && event.shiftKey;
    if(shift) {
      //if the user holds down shift the dice gets pushed into the diceToRoll Array for later bulk rolling
      this.diceToRoll.push(diceNumber);  
    
    } else {
      //if the user simply presses the button a singular die is rolled 
      this.scores = `D${diceNumber} = ${Math.floor(Math.random()*diceNumber) +1}`;
    
    }

  }

  rollTheDice() :void {
    let ticker = 0; //defines the variable that will store the sum of all the rolls made
 
    this.scores = ""; //clears the previous scoring 
 
    this.diceToRoll.forEach(die => {
      //rolls each die before adding it to the score variable
      let score = Math.floor(Math.random()*die) +1
      this.scores += `${score}, `;
      ticker += score;
    });
 
    this.scores += `   The combined score is: ${ticker}`; //adds the combined sum to the score variable 
 
  }

  clearTheDice() :void {
    //clears the dice to roll and scoring 
    this.diceToRoll = [];
    this.scores = "";
  }

  pushCurrentCharactertoBattler() :void {
    this.battlerHandler.loadNewCharacter(this.currentCharacter);
    this.battlerHandler.saveContent();
    this.battlerHandler.loadcontent()
  }

}
