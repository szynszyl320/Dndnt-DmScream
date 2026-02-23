import { Routes } from '@angular/router';
import { BattlerComponent } from './components/battler/battler.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    {
        path:'battler',
        component: BattlerComponent,
        data: ['test']
    },
    {
        path: '',
        component: MainComponent
    }
];
