import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, Directive } from '@angular/core';
import { Status } from 'src/app/model/Status';
import { BattleshipService } from 'src/app/services/battleship.service';
import { EnemyService } from 'src/app/services/enemy.service';
import { interval } from 'rxjs';
import { Settings } from 'src/app/model/Settings';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.css']
})
export class BattleshipComponent implements OnInit {  
  
  @Input() public tag: string;
  @Input() public turn: string; 

  @Output() public clicked: EventEmitter<Object> = new EventEmitter<Object>();

  public status: Status = new Status();
  public allShipCells: Array<string> = new Array<string>();
  public allCells = new Array<string>();

  public battleStatsArrays = {
    "four-deckers": [false],
    "three-deckers": [false, false],
    "two-deckers": [false, false, false],
    "one-deckers": [false, false, false, false]
  }

  constructor(private battleshipService: BattleshipService,
    private enemyService: EnemyService) {  }

    ngOnInit() {

  }

  public onCellClick(event): void {
    // Get id of the cell
    let target = event.target || event.srcElement || event.currentTarget;
    let id: string = target.parentNode.attributes.id.value;

    // Update cell status
    if (this.tag === 'Enemy') {
      this.clicked.emit({field: "Enemy", id: id});
    }

    if (this.tag === 'Player'){
      this.clicked.emit({field: "Player", id: id});
    }
    

  }//onCellClick

  public onCellHover(event): void {
    // Get id of the cell
    let target = event.target || event.srcElement || event.currentTarget;
    let id = target.attributes.id.value;
    let col: string = id[0]; // get column (a-j)
    let row: string = id.slice(1); // get row (1-10)

    // Highlight column an row
    if (this.tag === 'Enemy') {
      this.status.map[col]['active'] = true;
      this.status.map[row]['active'] = true;
    }

  }//onCellHover

  public onCellLeave(event): void {
    // Get id of the cell
    let target = event.target || event.srcElement || event.currentTarget;
    let id = target.attributes.id.value;
    let col: string = id[0]; // get column (a-j)
    let row: string = id.slice(1); // get row (1-10)

    // Highlight column an row
    if (this.tag === 'Enemy') {
      this.status.map[col]['active'] = false;
      this.status.map[row]['active'] = false;
    }


  }//onCellLeave

}
