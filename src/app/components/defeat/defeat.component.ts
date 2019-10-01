import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defeat',
  templateUrl: './defeat.component.html',
  styleUrls: ['./defeat.component.css']
})
export class DefeatComponent implements OnInit {

  public messageCounter = 0;
  public message: string = "";
  private messages = ["You were defeated!", "Are you sure you want to quit?", "Don't give up yet!"];

  constructor(private _router: Router) { }

  ngOnInit() {
    this.message = this.messages[0];
  }

  public playAgain() {
    this._router.navigate(["/settings"]);
  }

  public quitGame() {
    this.messageCounter++;

    // Leave if user persisted
    if (this.messageCounter < this.messages.length) {
      this.message = this.messages[this.messageCounter];
    }
    else {
      this.message = "Good luck!";
      this._router.navigate(["/outro"]);
    }
  }

}
