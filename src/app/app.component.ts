import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterSelectionComponent } from './components/character-selection/character-selection.component';
import { CharacterHandlerService } from './services/character-handler.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CharacterSelectionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'dndnt';

  currentCharacter :any;

  constructor(private characterHandler: CharacterHandlerService) {}

  ngOnInit() {

    this.characterHandler.$CurrentCharacter.subscribe((value: any) => {  
      this.currentCharacter = value;
    }); 

  }

  del(test: number) {
    this.characterHandler.deleteCharacter(test);
  }
}

