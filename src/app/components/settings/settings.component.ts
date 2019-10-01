import { Component, OnInit, ViewChild } from '@angular/core';
import { Settings } from 'src/app/model/Settings';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomBattlefieldComponent } from '../custom-battlefield/custom-battlefield.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild(CustomBattlefieldComponent, { static: false }) customBattlefield: CustomBattlefieldComponent;

  public userSettings = {...Settings.userSettings };
  public isPlayerChoiceValid = false;

  constructor(private _router: Router) {
    Object.assign(Settings.userSettings, Settings.defaultUserSettings);
   }

  ngOnInit() {
    
  }

  public Reset() {
    this.customBattlefield.initializeCustomMap();
  }

  validatePlayerCustomArrangement(args){
    this.isPlayerChoiceValid = args.isValid;
    // Update settings
    this.userSettings.PlayerShips = this.isPlayerChoiceValid ? args.CustomShips : {}
  }

  onSubmit(form: NgForm) {
    if (form.valid) {

      // Update user settings
      Object.assign(Settings.userSettings, this.userSettings);      

      this._router.navigate(['/battle']);
    }
  }//onSubmit


}
