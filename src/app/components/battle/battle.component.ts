import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Settings } from 'src/app/model/Settings';
import { BattleshipComponent } from '../battleship/battleship.component';
import { BattleshipService } from 'src/app/services/battleship.service';
import { EnemyService } from 'src/app/services/enemy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  @ViewChildren(BattleshipComponent) battleships: QueryList<BattleshipComponent>;

  public player;
  public enemy;
  public allowedToClick = true;
  public allowedToAttack = true;
  public lastTargetedCell = '';
  public availableNearby = {};
  public lastChosenDirection = "";



  //public settings: Settings = new Settings();
  public turn: string;

  constructor(private battleshipService: BattleshipService,
    private enemyService: EnemyService,
    private _router: Router) {

  }

  ngOnInit() {
    this.turn = "Player";
  }//ngOnInit

  ngAfterViewInit() {
    this.player = this.battleships.first;
    this.enemy = this.battleships.last;

    let ships;

    setTimeout(() => {
      // ----Player
      // Fill up all cells list
      this.player.allCells = this.battleshipService.getFullCellList();

      // Randomly generate full set of ships
      if (Settings.userSettings.ShipArrangement === "random")
        ships = this.battleshipService.generateRandomShips();
      else {
        ships = Settings.userSettings.PlayerShips;
      }
      // Update status
      this.player.battleshipService.updateStatus(this.player.tag,
        this.player.status, ships, this.player.allShipCells);

      // ----Enemy
      // Fill up all cells list
      this.enemy.allCells = this.battleshipService.getFullCellList();

      // Randomly generate full set of ships
      ships = this.battleshipService.generateRandomShips();

      // Update status
      this.enemy.battleshipService.updateStatus(this.enemy.tag,
        this.enemy.status, ships, this.enemy.allShipCells);

    }, 10);

  }

  public fieldClick(info): void {

    // Player attacks
    if (this.turn === "Player" && info.field === "Enemy") {
      // If player clicked on a visited cell or already clicked once 
      // and trying to click again nothing should happen
      if (this.enemy.status['map'][info.id]['visited'] || !this.allowedToClick)
        return

      // Forbid player to click twice per turn
      this.allowedToClick = false;

      // Update params of the clicked cell
      this.battleshipService.updateCellState(info.id, this.enemy.status, this.enemy.battleStatsArrays);
      // If enemy doesn't have ships anymore - player won
      if (!this.battleshipService.isAlive(this.enemy.status.ships)) {
        setTimeout(() => {
          this._router.navigate(['/victory']);
        }, Settings.userSettings.ScreenTransitionDelay);
      }
      // If player missed turn pass to the enemy
      if (this.enemy.status['map'][info.id]['state'] !== 'full') {
        setTimeout(() => {
          this.turn = "Enemy";
          this.enemyLogic();
          // Allow player to click again
          this.allowedToClick = true;
        }, Settings.userSettings.AfterAttackDelay);
      }
      else {
        // If player hit the target allow him to click again
        this.allowedToClick = true;
      }

    }
  }

  public enemyLogic(): void {
    //Enemy Attack
    let targetCell: string = '';
    let targets = new Array<string>();
    let finishers = new Array<string>(); // cells that were fatal for ships
    let defeated = []; // array of arrays;

    do {
      // First attack in this turn
      if (!targetCell) {
        // If has ship that survived attack from last turn  
        // Need to chose different direction to attack since last direction lead to miss  
        if (this.lastTargetedCell) {
          this.availableNearby = this.enemyService.getAvailableNearby(this.lastTargetedCell, this.player.allCells);
          // --- If there is not available cells nearby left, chose a random one
          if (!Object.keys(this.availableNearby).length)
            targetCell = this.battleshipService.getRandomMember(this.player.allCells);
          else {
            this.lastChosenDirection = this.enemyService.getRandomDirection(this.availableNearby); // reset last chosen direction
            targetCell = this.enemyService.getRandomCellNearby(this.availableNearby, this.lastChosenDirection);
          }
          this.lastTargetedCell = '';
        }
        // Has no ship to finish, choose random cell to attack
        else {
          targetCell = this.battleshipService.getRandomMember(this.player.allCells);
          this.availableNearby = this.enemyService.getAvailableNearby(targetCell, this.player.allCells);
          this.lastChosenDirection = this.enemyService.getRandomDirection(this.availableNearby); // reset last chosen direction
        }
      }
      // Continue to attack
      else {
        let type: string = this.player.status.map[targetCell]['rel']['type'];
        let index: number = this.player.status.map[targetCell]['rel']['index'];

        // If previous target was fatal - search for random target on the field
        if (this.enemyService.isShipDefeated(type, index, this.player.status)) {
          finishers.push(targetCell);
          defeated.push(this.player.status.info[type][index]);
          this.lastTargetedCell = '';
          targetCell = this.battleshipService.getRandomMember(this.player.allCells);
          this.availableNearby = this.enemyService.getAvailableNearby(targetCell, this.player.allCells);
          this.lastChosenDirection = this.enemyService.getRandomDirection(this.availableNearby); // reset last chosen direction
        }
        // Continue attacking the ship
        else {
          this.availableNearby = this.enemyService.getAvailableNearby(this.lastTargetedCell, this.player.allCells);
          targetCell = this.enemyService.getRandomCellNearby(this.availableNearby, this.lastChosenDirection);
        }

      }
      // Add chosen cell to the list of targets
      if (targetCell) {
        targets.push(targetCell);
        this.player.allCells.splice(this.player.allCells.indexOf(targetCell), 1);
        if (this.player.status['map'][targetCell]['state'] === 'full') {
          this.enemyService.moveCellToDefeated(targetCell, this.player.status);
          this.lastTargetedCell = targetCell;
        }

      }//if
    }
    while (targetCell && this.player.status['map'][targetCell]['state'] === 'full' && this.player.allCells.length);

    let timeToAttack = targets.length * Settings.userSettings.EnemyAttackDelay + 100;

    // Render attack on each cell
    for (let i = 0; i < targets.length; i++) {
      setTimeout(() => {
        this.enemyService.markCell(targets[i], this.player.status, finishers, this.player.battleStatsArrays);
        // Remove from available cells those that are around defeated ships
        for (let ship of defeated) {
          let arr = this.enemyService.getDeadSpaceAroundShip(ship);
          this.player.allCells = this.player.allCells.filter(cell => {
            return arr.indexOf(cell) === -1;
          });
        }
      }, Settings.userSettings.EnemyAttackDelay * (i + 1));
    }

    // --- Wait a little before passing the turn
    setTimeout(() => {
      // If player doesn't have ships anymore - enemy won
      if (!this.battleshipService.isAlive(this.player.status.ships)) {
        setTimeout(() => {
          this._router.navigate(['/defeat']);
        }, Settings.userSettings.ScreenTransitionDelay);
      }

      //Pass the turn to player
      this.turn = "Player";
    }, timeToAttack + Settings.userSettings.AfterAttackDelay);

  }//enemyLogic

}
