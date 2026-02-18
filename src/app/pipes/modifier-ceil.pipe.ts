//This pipe accepts numbers subtracts 10 from them before dividing them by two and rounding the number up. This pipe has been created because me and my friends use this for modifiers in our homebrew Camapaigns. 
// I'm planning to add support for 5e, when that day comes a pipe with the standard formula will be added
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifierCeil'
})
export class ModifierCeilPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == null) return null;

    let n: number;

    if (typeof value === 'number')  {
      //checks if the value passed is a number
      n = value;
    } else if(typeof value === 'string' && value.trim() !== '') {
      //checks if it's a string and parses it to a number.
      n = Number(value);
    } else {
      //if it's evidently not a string and bumber just returns null. 
      return null;
    }
    
    if (!Number.isFinite(n)) return null; //checks if the passed argument is finite, if not returns a null
    
    return Math.ceil((n-10)/2); //executes the formula 

  }

}
