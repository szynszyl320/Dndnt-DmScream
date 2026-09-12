
export interface MaidAttributes {
  athletics :number,
  affection :number,
  skill :number,
  cunning :number,
  luck :number,
  will :number
}

export class MaidClass {

  public name :string = "PlaceHolder";
  public campaign :string = "None";
  public age :number = 0;

  public clothesColor :string = "";
  public eyeColor :string = "";
  public hairColor :string = "";

  public maidRoots :string = "";
  public stressExplosion :string = "";
  public maidPower :string = "";

  public specialQualities :Array<string> = [];

  public maidTypes :Array<string> = [];

  public attributes :MaidAttributes = {
    athletics: 0,
    affection: 0,
    skill: 0,
    cunning: 0,
    luck: 0,
    will: 0
  };

  public stress :number = 0;
  public spirit :number = 0;

  public favor :number = 0;
  public startingFavor :number = 0;

  public notes :Array<string> = [];

  public weapons :Array<string> = [];

  public personality :Array<string> = [];

  public backStory :Array<string> = [];

  public appearanceBase64 :string = "";
  public characterAppearance :Blob = new Blob;

  public type :string = "maid";

  public changeStress(stressChange :number) {
    this.stress += stressChange;
  }

  public parseToString() :StringifiedMaidArrays {
    const strings :StringifiedMaidArrays = {
      specialQualitiesString: this.specialQualities.join('\n'),
      maidTypesString: this.maidTypes.join('\n'),
      notesString: this.notes.join('\n'),
      weaponsString: this.weapons.join('\n'),
      personalityString: this.personality.join('\n'),
      backStoryString: this.backStory.join('\n')
    }

    return strings;
  }

  public parseFromString(strings :StringifiedMaidArrays) :void {

    this.specialQualities = strings.specialQualitiesString.split('\n');
    this.maidTypes = strings.maidTypesString.split('\n');
    this.notes = strings.notesString.split('\n');
    this.weapons = strings.weaponsString.split('\n');
    this.personality = strings.personalityString.split('\n');
    this.backStory = strings.backStoryString.split('\n')

  }

}

export interface StringifiedMaidArrays {

  specialQualitiesString :string,
  maidTypesString :string,
  notesString :string,
  weaponsString :string,
  personalityString :string,
  backStoryString :string

}
