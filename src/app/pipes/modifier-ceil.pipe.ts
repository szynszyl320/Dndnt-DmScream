import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifierCeil'
})
export class ModifierCeilPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == null) return null;

    let n: number;

    if (typeof value === 'number') {
      n = value;
    } else if(typeof value === 'string' && value.trim() !== '') {
      n = Number(value);
    } else {
      return null;
    }
    
    if (!Number.isFinite(n)) return null;
    
    return Math.ceil((n-10)/2);

  }

}
