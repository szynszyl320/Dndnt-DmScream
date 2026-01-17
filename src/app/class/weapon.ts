//This is a class for weapons in my and my friends homebrew stuff, a 5e version is coming! Someday...

import { Character5e } from "./character-5e";
import { DndtCharacter } from "./dndt-character";
import { ScuffCharacter } from "./scuff-character";

export class Weapon {
    public name :string = "";
    public damage :string = "";
    public damageType :string = "";
    public bonusToHit :string = "";
    public description :string = "";
    public range :string = "";

    
    rollWeaponDamage() :string {
        const damageArray :Array<string> = this.damage.split(' ');

        const assignArray :Array<number> = [];
        const scoreArray :Array<number> = [];

        const trimmedDamageArray = damageArray.map((subString :string) => {
            return subString.replace(/(\(.*?\)|\+)/g, '').trim();
        })


        trimmedDamageArray.forEach((damageDeal :string) => {
            
            if(damageDeal.includes('d')) {
                let temporaryArray :Array<any> = damageDeal.split('d');
                
                temporaryArray = temporaryArray.map((num :string) => {
                    return parseInt(num);
                }) 
                
                assignArray.push(temporaryArray[0])
                for(let i :number = 0; i < temporaryArray[0]; i++) {
                    scoreArray.push(Math.floor(Math.random()*temporaryArray[1]) +1);
                }
            
            } else if (!isNaN(parseInt(damageDeal))) {
                assignArray.push(1)
                scoreArray.push(parseInt(damageDeal))
            }
        })   

        let returnScore :string = "";
        let offset :number = 0;

        for (let i :number = 0; i < assignArray.length; i++) {
            let temporaryScore = 0;  
            for (let j :number =  0; j < assignArray[i]; j++) {
            temporaryScore += scoreArray[offset + j];
            }
            offset += assignArray[i];
            returnScore += ` +${temporaryScore} |`;
        }

        let result :number = 0;
        scoreArray.forEach(score => {
            result += score;
        });

        return `The roll for damage was: ${result}. Specifically speaking: | ${returnScore}`;
    }

}

