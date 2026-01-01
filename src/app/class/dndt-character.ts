//This is a class created for my friends DnDn't campaign 

import { DndntSpell } from "./dndnt-spell";
import { Weapon } from "./weapon";

export class DndtCharacter {
public name :string = "Placeholder";
    public playerName :string = "";
    public level :number = 0;
    public race :string = "";
    public gender :string = "";
    public campaign :string = "None";

    public maxMaxHP :number = 0;
    public maxHp :number = 0;
    public currentHp :number = 0;
    public ac :number = 0;

    public weapons :Array<Weapon> = [];
    
    public spells :Array<DndntSpell> = [];

    public str :number = 0;
    public dex :number = 0;
    public con :number = 0;
    public int :number = 0;
    public wis :number = 0;
    public cha :number = 0;

    public height :string = "";

    public magicType :string = "";

    public traits :Array<string> = [];

    public languages :Array<string> = [];
    
    public proficiencies :Array<string> = [];

    public origin :string = "";

    public inventory :Array<string> = [];

    public type :string = "dndnt"
}
