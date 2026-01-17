import { CharacterBaseplate } from "./character-baseplate";
import { Spell5e } from "./spell-5e";

export class Character5e extends CharacterBaseplate {

    public background :string = "";
    public alignment :string = "";
    public experiencePoints :string = "";
    public class :string = "";
    public faction :string = "";

    public inspiration :number = 0;
    public proficiencyBonus :number = 0;

    public initiative :number = 0;
    public movement :number = 0;

    //Saving throws
    public strSavingThrow :number = 0;
    public dexSavingThrow :number = 0;
    public conSavingThrow :number = 0;
    public intSavingThrow :number = 0;
    public wisSavingThrow :number = 0;
    public chaSavingThrow :number = 0;

    //Saving throw proficiencies
    public strSavingThrowChecked :boolean = false;
    public dexSavingThrowChecked :boolean = false;
    public conSavingThrowChecked :boolean = false;
    public intSavingThrowChecked :boolean = false;
    public wisSavingThrowChecked :boolean = false;
    public chaSavingThrowChecked :boolean = false;

    //Skills
    public acrobatics :number = 0;
    public animalHandling :number = 0;
    public arcana :number = 0;
    public athletics :number = 0;
    public deception :number = 0;
    public history :number = 0;
    public insight :number = 0;
    public intimidation :number = 0;
    public investigation: number = 0;
    public medicine :number = 0;
    public nature :number = 0;
    public perception :number = 0;
    public performance :number = 0;
    public persuasion :number = 0;
    public religion :number = 0;
    public sleightOfHand :number = 0;
    public stealth :number = 0;
    public survival :number = 0;

    //Skills proficiencies
    public acrobaticsProf :boolean = false;
    public animalHandlingProf :boolean = false;
    public arcanaProf :boolean = false;
    public athleticsProf :boolean = false;
    public deceptionProf :boolean = false;
    public historyProf :boolean = false;
    public insightProf :boolean = false;
    public intimidationProf :boolean = false;
    public investigationprof :boolean = false;
    public medicineProf :boolean = false;
    public natureProf :boolean = false;
    public perceptionProf :boolean = false;
    public performanceProf :boolean = false;
    public persuasionProf :boolean = false;
    public religionProf :boolean = false;
    public sleightOfHandProf :boolean = false;
    public stealthProf :boolean = false;
    public survivalProf :boolean = false;


    public temporaryHitPoints :number = 0;

    public otherWeaponsAndAttacks :Array<string> = [];

    //Hit dice 
    public totalHitDice :number = 0;
    public hitDice :string = "";

    //Death saves
    public saves :number = 0;
    public failures :number = 0;

    public personalityTraits :Array<string> = [];
    public ideals :Array<string> = [];
    public bonds :Array<string> = [];
    public flaws :Array<string> = [];

    public passivePerception :number = 0;

    public proficiencies :Array<string> = [];
    public languages: Array<string> = [];
    public equipment :Array<string> = [];
    public featuresAndTraits :Array<string> = [];

    public cp :number = 0;
    public sp :number = 0;
    public ep :number = 0;
    public gp :number = 0;
    public pp :number = 0;

    public factionRank :string = "";
    public alliesAndOrganisations :Array<string> = [];
    public additionalFeaturesAndTraits :Array<string> = [];
    public magicItems :Array<string> = [];

    public preparedSpells :number = 0;
    public spellSaveDc :number = 0;
    public spellAttackBonus :number = 0;

    //Spells 
    public cantrips :Array<Spell5e> = [];
    public lvl1Spells :Array<Spell5e> = [];
    public lvl2Spells :Array<Spell5e> = [];
    public lvl3Spells :Array<Spell5e> = [];
    public lvl4Spells :Array<Spell5e> = [];
    public lvl5Spells :Array<Spell5e> = [];
    public lvl6Spells :Array<Spell5e> = [];
    public lvl7Spells :Array<Spell5e> = [];
    public lvl8Spells :Array<Spell5e> = [];
    public lvl9Spells :Array<Spell5e> = [];

    public type :string = '5e';

}
