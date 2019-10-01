import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BattleComponent } from './components/battle/battle.component';
import { OutroComponent } from './components/outro/outro.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { VictoryComponent } from './components/victory/victory.component';
import { DefeatComponent } from './components/defeat/defeat.component';

const routes: Routes = [
{path:"home", component:HomeComponent},
{path:"settings", component:SettingsComponent},
{path:"battle", component:BattleComponent},
{path:"outro", component:OutroComponent},
{path:"victory", component:VictoryComponent},
{path:"defeat", component:DefeatComponent},
{path:"about", component:AboutComponent},
{path:"", pathMatch:"full", redirectTo:"/home"},
{path:"**", component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
