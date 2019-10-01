import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-battlestate',
  templateUrl: './battlestate.component.html',
  styleUrls: ['./battlestate.component.css']
})
export class BattlestateComponent implements OnInit {

  @Input() public battleStatsArrays;

  constructor() { }

  ngOnInit() {
  }

}
