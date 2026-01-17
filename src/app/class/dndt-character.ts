//This is a class created for my friends DnDn't campaign 

import { CharacterBaseplate } from "./character-baseplate";
import { DndntSpell } from "./dndnt-spell";

export class DndtCharacter extends CharacterBaseplate {
    public maxMaxHP :number = 0;
    
    public override spells :Array<DndntSpell> = [];

    public height :string = "";

    public magicType :string = "";

    public traits :Array<string> = [];

    public languages :Array<string> = [];
    
    public proficiencies :Array<string> = [];

    public clothes :Array<string> = [];

    public wounds :Array<string> = [];

    public inventory :Array<string> = [];

    public type :string = "dndnt"
}
