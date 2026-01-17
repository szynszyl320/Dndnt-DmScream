import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifier5e'
})
export class Modifier5ePipe implements PipeTransform {

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
      
      return Math.floor((n-10)/2); //executes the formula 
  
    }

}
