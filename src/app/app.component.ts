import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Components
import { CharacterSelectionComponent } from './components/character-selection/character-selection.component';
import { CharacterComponent } from './components/character/character.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CharacterSelectionComponent,
    CharacterComponent,
    ToolboxComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'dndnt';
}

