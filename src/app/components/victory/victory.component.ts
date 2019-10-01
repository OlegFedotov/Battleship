import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-victory',
  templateUrl: './victory.component.html',
  styleUrls: ['./victory.component.css']
})
export class VictoryComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  public playAgain() {
    this._router.navigate(["/settings"]);
  }

  public quitGame() {
    this._router.navigate(["/outro"]);
  }


}
