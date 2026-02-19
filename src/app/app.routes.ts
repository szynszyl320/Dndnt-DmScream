import { Routes } from '@angular/router';
import { BattlerComponent } from './components/battler/battler.component';

export const routes: Routes = [
    {
        path:'battler',
        component: BattlerComponent,
        data: ['test']
    },
];
