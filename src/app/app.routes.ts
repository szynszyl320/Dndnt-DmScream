import { Routes } from '@angular/router';
import { BattlerComponent } from './components/battler/battler.component';
import { MainComponent } from './components/main/main.component';
import { ComposerComponent } from './composer/composer.component';

export const routes: Routes = [
    {
        path:'battler',
        component: BattlerComponent,
    },
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'composer',
        component: ComposerComponent
    }
];
