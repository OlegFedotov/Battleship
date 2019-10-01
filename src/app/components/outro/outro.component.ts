import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/model/Settings';

@Component({
  selector: 'app-outro',
  templateUrl: './outro.component.html',
  styleUrls: ['./outro.component.css']
})
export class OutroComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
    setTimeout(()=>{
      this._router.navigate([""]);
    }, Settings.userSettings.ExitDelay);
  }

}
