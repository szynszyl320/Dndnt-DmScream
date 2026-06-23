import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BattlerHandlerService } from '../../services/battler-handler.service';

@Component({
  selector: 'app-custom-damage-input',
  imports: [FormsModule],
  templateUrl: './custom-damage-input.component.html',
  styleUrl: './custom-damage-input.component.css'
})
export class CustomDamageInputComponent {

  constructor(private battleHandler: BattlerHandlerService) {}

  isCustomAttackPopupVisible :boolean = false

  damage :number = 0;
  rollToHit :number = 0;
  advantage :number = 0; 


  ngOnInit() {
    this.battleHandler.$IsCustomAttackVisible.subscribe((value :any) => {
      this.isCustomAttackPopupVisible = value;
    })
  }
  
  inputCustomAttackStatistics() {
    this.battleHandler.loadSpecialAttackInformation(this.damage, this.rollToHit, this.advantage)
    this.damage = 0;
    this.rollToHit = 0;
    this.advantage = 0;
    this.battleHandler.switchCustomAttackInput();
  }


}
