export class CallOfCuthulu {
  name :string = "";
  campaign :string = "";
  player :string = "";
  occupation :string = "";
  age :number = 0;
  sex :string = ""
  residence :string = "";
  birthplace :string = "";

  // ---------------------------------

  characteristics :Characteristics = {
    str: 0,
    con: 0,
    siz: 0,
    dex: 0,
    app: 0,
    int: 0,
    pow: 0,
    edu: 0,
    moveRate: 0
  }

  // ---------------------------------

  hp :number = 0;
  maxHp :number = 20;
  majorWound :boolean = false;

  // ---------------------------------

  sp :number = 0;
  maxSp :number = 99;
  tempInsanity :boolean = false;
  indefiniteInsanity :boolean = false;

  //---------------------------------

  mp :number = 0;
  maxMp :number = 24;

  // ---------------------------------

  luck: number = 0;
  maxLuck :number = 0;

  // ---------------------------------

  investigatorSkills :InvestigatorSkills = {
    accounting: 0,
    anthropology: 0,
    appraise: 0,
    archeology: 0,
    art_craft: 0,
    charm: 0,
    climb: 0,
    creditRating: 0,
    cthuluMythos: 0,
    disguise: 0,
    dodge: 0,
    driveAuto: 0,
    elecRepair: 0,
    fastTalk: 0,
    fighting: 0,
    firearms_handgun: 0,
    firearms_rifle_shotgun: 0,
    firstAid: 0,
    history: 0,
    hypnosis: 0,
    intimidate: 0,
    jump: 0,
    language_other: 0,
    language_own: 0,
    law: 0,
    libraryUse: 0,
    listen: 0,
    locksmith: 0,
    mechRepair: 0,
    medicine: 0,
    naturalWorld: 0,
    navigate: 0,
    occult: 0,
    opHvMachine: 0,
    persuade: 0,
    pilot: 0,
    psychology: 0,
    psychoanalisys: 0,
    ride :0,
    science: 0,
    sleightOfHand: 0,
    spotHidden: 0,
    stealth: 0,
    survival: 0,
    swim: 0,
    throw: 0,
    track: 0
  }

  // --------------------------------

  weapons :Array<CCweapon> = [];

  damageBonus :string = "";
  build :number = 0;

  // ---------------------------------

  private personalDescription :string[] = [];
  private idealogyBeliefs :string[] = [];
  private significantPeople :string[] = [];
  private traits :string[] = [];
  private injuriesAndScars :string[] = [];
  private phobiasAndMainias :string[] = [];
  private arcaneTomesSpellsAndArtifacts :string[] = [];
  private meaningfulLocations :string[] = [];
  private treassuredPossessions :string[] = [];
  private enccountersWithStrangeEntities :string[] = [];

  // ---------------------------------

  private gearAndPossessions :string[] = [];
  private spendingLevel :string[] = [];
  cash :number = 0;
  private assets :string[] = [];

  // ---------------------------------

  fellowInvestigators :Array<fellowInvestigator> = [];

  type :string = "call_of_cuthulu";

  stringifyData() :stringifiedData {
    const temporaryData :stringifiedData = {
      personalDescription: this.personalDescription.join('\n'),
      idealogyBeliefs: this.idealogyBeliefs.join('\n'),
      significantPeople: this.significantPeople.join('\n'),
      traits: this.traits.join('\n'),
      injuriesAndScars: this.injuriesAndScars.join('\n'),
      phobiasAndMainias: this.phobiasAndMainias.join('\n'),
      arcaneTomesSpellsAndArtifacts: this.arcaneTomesSpellsAndArtifacts.join('\n'),
      meaningfulLocations: this.meaningfulLocations.join('\n'),
      treassuredPossessions: this.treassuredPossessions.join('\n'),
      enccountersWithStrangeEntities: this.enccountersWithStrangeEntities.join('\n'),
      gearAndPossessions: this.gearAndPossessions.join('\n'),
      spendingLevel: this.spendingLevel.join('\n'),
      assets: this.assets.join('\n'),
    }

    return temporaryData;
  }

  deStringifyData(data :stringifiedData) :void {
    if (!data) return

    this.personalDescription = data.personalDescription.split('\n');
    this.idealogyBeliefs = data.idealogyBeliefs.split('\n');
    this.significantPeople = data.significantPeople.split('\n');
    this.traits = data.traits.split('\n');
    this.injuriesAndScars = data.injuriesAndScars.split('\n');
    this.phobiasAndMainias = data.phobiasAndMainias.split('\n');
    this.arcaneTomesSpellsAndArtifacts = data.arcaneTomesSpellsAndArtifacts.split('\n');
    this.meaningfulLocations = data.meaningfulLocations.split('\n');
    this.treassuredPossessions = data.treassuredPossessions.split('\n');
    this.enccountersWithStrangeEntities = data.enccountersWithStrangeEntities.split('\n');
    this.gearAndPossessions = data.gearAndPossessions.split('\n');
    this.spendingLevel = data.spendingLevel.split('\n');
    this.assets = data.assets.split('\n');
  }

}

export interface stringifiedData {
  personalDescription :string;
  idealogyBeliefs :string;
  significantPeople :string;
  traits :string;
  injuriesAndScars :string;
  phobiasAndMainias :string;
  arcaneTomesSpellsAndArtifacts :string;
  meaningfulLocations :string;
  treassuredPossessions :string;
  enccountersWithStrangeEntities :string;
  gearAndPossessions :string;
  spendingLevel :string;
  assets :string;
}

export interface Characteristics {
  str :number;
  con :number;
  siz :number;
  dex :number;
  app :number;
  int :number;
  pow :number;
  edu :number;
  moveRate :number;
}

export class CCweapon {
  name :string = "";
  regular :number = 0;
  hard :number = 0;
  extreme :number = 0;
  damage :string = "";
  range :number = 0;
  attacks :number = 0;
  ammo :number = 0;
  malfunction :string = "";
}

export interface fellowInvestigator {
  name: string;
  player :string;
}

export interface InvestigatorSkills {
  accounting :number;
  anthropology :number;
  appraise :number;
  archeology :number;
  art_craft :number;

  // ---------------------------------

  charm :number;
  climb :number;
  creditRating :number;
  cthuluMythos :number;

  // ---------------------------------

  disguise :number;
  dodge :number;
  driveAuto :number;

  // ---------------------------------

  elecRepair: number;

  // ---------------------------------

  fastTalk :number;
  fighting :number;
  firearms_handgun :number;
  firearms_rifle_shotgun :number;
  firstAid :number;

  // ---------------------------------

  history :number;
  hypnosis :number;

  // ---------------------------------

  intimidate :number;

  // ---------------------------------

  jump :number;

  // ---------------------------------

  language_other :number;
  language_own :number;
  law :number;
  libraryUse :number;
  listen :number;
  locksmith :number;

  // ---------------------------------

  mechRepair :number;
  medicine :number;

  // ---------------------------------

  naturalWorld :number;
  navigate :number;

  // ---------------------------------

  occult :number;
  opHvMachine :number;

  // ---------------------------------

  persuade :number;
  pilot :number;
  psychology :number;
  psychoanalisys :number;

  // ---------------------------------

  ride :number;

  // ---------------------------------

  science :number;
  sleightOfHand :number;
  spotHidden :number;
  stealth :number;
  survival :number;
  swim :number;

  // ---------------------------------

  throw :number;
  track :number;

  // --------------------------------


  [key :number] :string;
}
