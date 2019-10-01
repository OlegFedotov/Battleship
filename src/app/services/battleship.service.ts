import { Injectable } from '@angular/core';
import { Status } from '../model/Status';

@Injectable({
  providedIn: 'root'
})
export class BattleshipService {
  public cols = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  public isShipDefeated(type: string, index: number, status: Status): boolean {
    let ship: Array<string> = status.ships[type][index];

    if (ship.length)
      return false;

    // If nothing left of the ship the blow was fatal
    return true;

  }

  public isAlive(ships): boolean {
    let keys = Object.keys(ships);
    for (let key of keys) {
      for (let ship of ships[key]) {
        if (ship.length)
          return true;
      }
    }
    // If there is no ships left
    return false;
  }

  public moveCellToDefeated(id: string, status: Status): void {
    let cell = status.map[id];
    let type: string = cell['rel']['type'];
    let index: number = cell['rel']['index'];
    let ship: Array<string> = status.ships[type][index];
    let shipsInfo = status.info[type][index];

    // --- Remove cell from status.ships and add to status.info
    let removed: Array<string> = ship.splice(ship.indexOf(id), 1);
    shipsInfo.push(removed[0]);
  }

  public updateBattlestate(id: string, status: Status, battleStatsArrays): void {
    let cell = status.map[id];
    let type: string = cell['rel']['type'];

    // ---Remove respective icon from battlestate
    let i = battleStatsArrays[type].indexOf(false);
    if (i !== -1)
      battleStatsArrays[type][i] = true;
  }

  public markShipAsDefeated(type: string, index: number, status: Status): void {
    let shipsInfo = status.info[type][index];

    shipsInfo.forEach(c => {
      status.map[c]['cell-image'] = 'destroyed.png';
    });
  }

  public updateStatus(tag: string, status: Status, ships: Object, availableCells: Array<string>): void {
    // Update status
    status.ships["four-deckers"] = ships["four-deckers"];
    status.ships["three-deckers"] = ships["three-deckers"];
    status.ships["two-deckers"] = ships["two-deckers"];
    status.ships["one-deckers"] = ships["one-deckers"];

    // Create a list of ship cells 
    // --- Loop through each set of ships (four-deckers, three-deckers etc.)    
    Object.keys(ships).forEach(
      key => {
        // --- Loop through each ship
        let shipSet = Array.from(ships[key]);
        for (let ship of shipSet) {
          // --- Loop throuh each cell          
          let index = shipSet.indexOf(ship);
          let shipArray = ship as Array<string>;
          for (let cell of shipArray) {
            availableCells.push(cell); // Add cell to the list of ship cells
            status.map[cell]['rel']['type'] = key; // Store cell's ship type
            status.map[cell]['rel']['index'] = index; // Store cell's ship number 
            status.map[cell]['state'] = "full"; // Store cell state

            if (tag === "Player") {
              status.map[cell]['cell-image'] = "ship-cell.png"; // Store cell's image
            }
            else if (tag === "Enemy") {
              status.map[cell]['cell-image'] = "empty-cell.png"; // Store cell's image
            }

          }
        }
      }
    );

  }//updateStatus

  public updateCellState(cellID: string, status: Status, battleStatsArrays): void {

    if (!cellID)
      return

    // Access cell status
    let cell = status.map[cellID];

    if (!cell['visited']) {
      // If cell wasn't visited give it new state
      cell['visited'] = true;
      // --- if it's empty make it checked
      if (cell.state === "empty") {
        cell['cell-image'] = "checked-cell.png";
      }
      // --- if it's full make it crossed
      else if (cell.state === "full") {
        cell['cell-image'] = "dead-cell.png";
        //--- Access cell's ship
        let type: string = cell['rel']['type'];
        let index: number = cell['rel']['index'];

        this.moveCellToDefeated(cellID, status);

        // If entire ship is gone
        if (this.isShipDefeated(type, index, status)) {
          // ---Remove respective icon from battlestate
          this.updateBattlestate(cellID, status, battleStatsArrays);
          // ---Change ship's appearance so user will know the ship is destroyed
          this.markShipAsDefeated(type, index, status);
        }

      }
    }

  }//updateCellState


  public getFullCellList(): Array<string> {
    let result = [];
    for (let col of this.cols) {
      for (let i = 1; i <= 10; i++) {
        result.push(col + i);
      }
    }
    return result;
  }

  private randomSort(arr) {
    let result = [];
    let copy = [...arr];
    while (copy.length) {
      let index = copy.indexOf(this.getRandomMember(copy));
      result.push(copy.splice(index, 1));
    }
    return result;
  }

  protected getRandomShip(decksCount: number, availableCells: Array<string>): Array<string> {
    let result = [];
    let ok = false;

    while (!ok) {
      let randomCell: string = this.getRandomMember(availableCells);
      let randCol: string = randomCell[0];
      let randRow: number = +randomCell.slice(1);

      // Set four functions that try to create a ship
      // Each function for its own direction
      let tries = [
        () => {
          // Try downward direction
          for (let i = 0; i <= decksCount - 1; i++) {
            let currentCell = randCol + (randRow + i);
            if (availableCells.indexOf(currentCell) !== -1)
              result.push(currentCell);
            else {
              result = []; // Reset result
              break;
            }
          }
        },
        () => {
          // Try right direction
          for (let i = 0; i <= decksCount - 1; i++) {
            // Find next cell name
            let currentCell = this.cols[this.cols.indexOf(randCol) + i] + randRow;
            if (availableCells.indexOf(currentCell) !== -1)
              result.push(currentCell);
            else {
              result = []; // Reset result
              break;
            }
          }
        },
        () => {
          // Try upward direction
          for (let i = 0; i <= decksCount - 1; i++) {
            let currentCell = randCol + (randRow - i);
            if (availableCells.indexOf(currentCell) !== -1)
              result.push(currentCell);
            else {
              result = []; // Reset result
              break;
            }
          }

        },
        () => {
          // Try left direction
          for (let i = 0; i <= decksCount - 1; i++) {
            // Find previous cell name
            let currentCell = this.cols[this.cols.indexOf(randCol) - i] + randRow;
            if (availableCells.indexOf(currentCell) !== -1)
              result.push(currentCell);
            else {
              result = []; // Reset result
              break;
            }
          }

        }
      ]

      // Create random order of actions
      let orderOfActions = this.randomSort([0, 1, 2, 3]);

      // Try to create ship
      for (let index of orderOfActions) {
        // Call randomly selected function
        tries[index]();
        // Break the loop if managed to create a ship
        if (result.length === decksCount) {
          ok = true;
          break;
        }

      }



    }//while



    return result;

  }

  public getDeadSpaceAroundShip(ship: Array<string>): Array<string> {
    let result = [];

    for (let cell of ship) {
      // Check left border if in a column
      let cols = [];
      let rows = [];
      // Define cols
      if (cell[0] === "a")
        cols = ["a", "b"];
      else if (cell[0] === "j")
        cols = ["i", "j"];
      else {
        cols = [this.cols[this.cols.indexOf(cell[0]) - 1],
        cell[0],
        this.cols[this.cols.indexOf(cell[0]) + 1]
        ];
      }
      // Define rows
      let rowNum = Number(cell.slice(1));
      if (rowNum === 1)
        rows = ["1", "2"];
      else if (rowNum === 10)
        rows = ["9", "10"];
      else {
        rows = [(rowNum - 1).toString(),
        cell.slice(1),
        (rowNum + 1).toString()
        ];
      }

      // Fill up the result
      for (let col of cols) {
        for (let row of rows) {
          result.push(col + row);
        }
      }
    }//for


    return result;
  }

  protected updateAvailableSpace(availableSpace: Array<string>, ship: Array<string>): void {
    // Define dead space (cells around the ship)
    let deadSpace = this.getDeadSpaceAroundShip(ship);
    // Remove used cells from availables
    deadSpace.forEach(cell => {
      if (availableSpace.indexOf(cell) !== -1)
        availableSpace.splice(availableSpace.indexOf(cell), 1);
    });

  }

  public generateRandomShips(): Object {
    let result = {
      "four-deckers": [],
      "three-deckers": [],
      "two-deckers": [],
      "one-deckers": []
    }

    let availableCells = this.getFullCellList(); // Initialize list of available cells
    let currentShip: Array<string>;

    // Add one four-decker ship
    currentShip = this.getRandomShip(4, availableCells);
    this.updateAvailableSpace(availableCells, currentShip);
    result["four-deckers"].push(currentShip);

    // Add two three-decker ships
    for (let i = 1; i <= 2; i++) {
      currentShip = this.getRandomShip(3, availableCells);
      this.updateAvailableSpace(availableCells, currentShip);
      result["three-deckers"].push(currentShip);
    }

    // Add three two-decker ships
    for (let i = 1; i <= 3; i++) {
      currentShip = this.getRandomShip(2, availableCells);
      this.updateAvailableSpace(availableCells, currentShip);
      result["two-deckers"].push(currentShip);
    }

    // Add four one-decker ships
    for (let i = 1; i <= 4; i++) {
      currentShip = this.getRandomShip(1, availableCells);
      this.updateAvailableSpace(availableCells, currentShip);
      result["one-deckers"].push(currentShip);
    }

    return result;

  }//generateRandomShips


  public getRandomMember(arr: Array<any>) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }


  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
