//This is a class created for my homebrew Generation Ship campaign. 
import { Weapon } from "./weapon";

export class ScuffCharacter {

    public name :string = "Placeholder";
    public playerName :string = "";
    public level :number = 0;
    public race :string = "";
    public gender :string = "";
    public campaign :string = "None";

    public maxHp :number = 0;
    public currentHp :number = 0;
    public ac :number = 0;

    public weapons :Array<Weapon> = [];
    
    public str :number = 0;
    public dex :number = 0;
    public con :number = 0;
    public int :number = 0;
    public wis :number = 0;
    public cha :number = 0;

    public height :string = "";

    public traits :Array<string> = [];

    public languages :Array<string> = [];
    
    public proficiencies :Array<string> = [];

    public clothes :Array<string> = [];

    public statuses :Array<string> = [];

    public origin :string = "";

    public implants :Array<string> = [];

    public inventory :Array<string> = [];

    public components :Array<string> = [];

    public type :string = "generation ship"
}
