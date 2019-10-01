import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { LayoutComponent } from './components/layout/layout.component';
import { BattleshipComponent } from './components/battleship/battleship.component';
import { BattlestateComponent } from './components/battlestate/battlestate.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BattleComponent } from './components/battle/battle.component';
import { OutroComponent } from './components/outro/outro.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { VictoryComponent } from './components/victory/victory.component';
import { DefeatComponent } from './components/defeat/defeat.component';
import { CustomBattlefieldComponent } from './components/custom-battlefield/custom-battlefield.component';

@NgModule({
  declarations: [
    LayoutComponent,
    BattleshipComponent,
    BattlestateComponent,
    HomeComponent,
    SettingsComponent,
    BattleComponent,
    OutroComponent,
    AboutComponent,
    PageNotFoundComponent,
    VictoryComponent,
    DefeatComponent,
    CustomBattlefieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
