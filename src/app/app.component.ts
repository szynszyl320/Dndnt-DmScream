import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Components
import { CharacterSelectionComponent } from './components/character-selection/character-selection.component';
import { CharacterComponent } from './components/character/character.component';

//Services
import { CharacterHandlerService } from './services/character-handler.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CharacterSelectionComponent,
    CharacterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'dndnt';
}

