import { DndntSpell } from "./dndnt-spell";
import { Spell5e } from "./spell-5e";
import { Weapon } from './weapon';

export class CharacterBaseplate {

    
    public name :string = "Placeholder";
    public playerName :string = "";
    public race :string = "";
    public gender :string = "";
    public campaign :string = "None";
    public level :number = 0;

    public maxHp :number = 0;
    public currentHp :number = 0;
    public ac :number = 0;

    public str :number = 0;
    public dex :number = 0;
    public con :number = 0;
    public int :number = 0;
    public wis :number = 0;
    public cha :number = 0;

    public weapons :Array<Weapon> = [];

    public spells :Array<DndntSpell | Spell5e> = [];

    public origin :string = "";

    public characterAppearance :Blob = new Blob;

}
