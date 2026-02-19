//This is a class created for my homebrew Generation Ship campaign. 
import { CharacterBaseplate } from "./character-baseplate";

export class ScuffCharacter extends CharacterBaseplate {

    public shieldAc :number = 0;
    public shieldHp :number = 0;

    public height :string = "";

    public bodyType :string = ""

    public traits :Array<string> = [];

    public languages :Array<string> = [];
    
    public proficiencies :Array<string> = [];

    public clothes :Array<string> = [];

    public statuses :Array<any> = [];

    public implants :Array<string> = [];

    public inventory :Array<string> = [];

    public components :Array<string> = [];


    public type :string = "generation ship";


}
