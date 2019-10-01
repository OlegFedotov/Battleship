import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-battlefield',
  templateUrl: './custom-battlefield.component.html',
  styleUrls: ['./custom-battlefield.component.css']
})
export class CustomBattlefieldComponent implements OnInit {

  @Output() public validate: EventEmitter<Object> = new EventEmitter<Object>();

  public cols = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  public playerCustomMap = {};
  public playerCustomShips = {};
  public ships = {}

  constructor() { }

  ngOnInit() {
    // Create default custom map 
    this.initializeCustomMap();
    // Initialize player custom ships object
    this.playerCustomShips = this.updateCustomField();
  }

  public initializeCustomMap() {
    this.playerCustomMap = {};
    this.playerCustomShips = {
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    }
    this.ships = {
      "four-deckers": [],
      "three-deckers": [],
      "two-deckers": [],
      "one-deckers": []
    }
    for (let col of this.cols) {
      for (let i = 1; i <= 10; i++) {
        let entry = col + i;
        this.playerCustomMap[entry] = {
          "image": "empty-cell.png",
          "full": false
        }
      }
    }//for

  }

  public onCellClick(event): void {
    //event.preventDefault();
    // Get id of the cell
    let target = event.target || event.srcElement || event.currentTarget;
    let id: string = target.parentNode.attributes.id.value;


    if (this.allowedToPick(this.getNearbyCellDiagonal(id))) {
      // Change cell state
      this.playerCustomMap[id].full = !this.playerCustomMap[id].full
      // Change cell image
      if (this.playerCustomMap[id].image === "empty-cell.png") {
        this.playerCustomMap[id].image = "ship-cell.png"
      }
      else {
        this.playerCustomMap[id].image = "empty-cell.png"
      }
    }// allowedToPick if

    this.playerCustomShips = this.updateCustomField();
    this.validate.emit({
      'isValid': this.playerCustomShips["4"] === 1 && this.playerCustomShips["3"] === 2 && this.playerCustomShips["2"] === 3 && this.playerCustomShips["1"] === 4,
      'CustomShips': this.ships
    });

  }//onCellClick

  public allowedToPick(nearbyDiagonal: Array<string>): boolean {

    // If there is a ship placed diagonally nearby forbid to choose this cell
    for (let id of nearbyDiagonal) {
      if (this.playerCustomMap[id].full)
        return false;
    }

    return true;
  }

  public getNearbyCellDiagonal(id: string): Array<string> {
    let result: Array<string> = new Array<string>();
    let col = id[0];
    let row = +id.slice(1);
    let colIndex = this.cols.indexOf(col);

    // Check left side
    if (colIndex - 1 >= 0) {
      // Check upper corner
      if (row - 1 >= 1)
        result.push(this.cols[colIndex - 1] + (row - 1));
      // Check lower corner
      if (row + 1 <= 10)
        result.push(this.cols[colIndex - 1] + (row + 1));
    }

    // Check right side
    if (colIndex + 1 <= 9) {
      // Check upper corner
      if (row - 1 >= 1)
        result.push(this.cols[colIndex + 1] + (row - 1));
      // Check lower corner
      if (row + 1 <= 10)
        result.push(this.cols[colIndex + 1] + (row + 1));
    }

    return result;
  }

  public getAllShipCells(id: string): Array<string> {
    let result: Array<string> = new Array<string>();
    let col = id[0];
    let row = +id.slice(1);
    let colIndex = this.cols.indexOf(col);
    let currentRow;
    let currentColIndex;

    // Add cell itself
    result.push(id);

    // Check up
    currentRow = row - 1;
    while (currentRow >= 1 && this.playerCustomMap[col + currentRow].full) {
      result.push(col + currentRow);
      currentRow--;
    }
    // Check down
    currentRow = row + 1;
    while (currentRow <= 10 && this.playerCustomMap[col + currentRow].full) {
      result.push(col + currentRow);
      currentRow++;
    }
    // Check left
    currentColIndex = colIndex - 1;
    while (currentColIndex >= 0 && this.playerCustomMap[this.cols[currentColIndex] + row].full) {
      result.push(this.cols[currentColIndex] + row);
      currentColIndex--;
    }
    // Check right
    currentColIndex = colIndex + 1;
    while (currentColIndex <= 9 && this.playerCustomMap[this.cols[currentColIndex] + row].full) {
      result.push(this.cols[currentColIndex] + row);
      currentColIndex++;
    }

    //console.log(`Ship ${result.length} : ${result}`);
    return result;
  }

  public updateCustomField(): Object {
    this.ships = {
      "four-deckers": [],
      "three-deckers": [],
      "two-deckers": [],
      "one-deckers": []
    }

    // Copy values from player custom map
    let m = { ...this.playerCustomMap }
    let result = {
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    }

    // Count all ships on battlefield
    while ((Object.keys(m).length)) {
      let cell = Object.keys(m)[0];
      // if cell is empty just remove it
      if (!this.playerCustomMap[cell]['full'])
        delete m[cell];
      // If cell is a ship-cell, find all nearby ship-cells count and delete them
      else {
        let count: number = 0;
        let shipCells = this.getAllShipCells(cell);
        // --- count and delete each ship cell
        shipCells.forEach(c => {
          count++;
          delete m[c];
        });
        // --- add counted cells to result
        if (count && count <= 4) {
          result[count.toString()]++;
          if (count === 4)
            this.ships["four-deckers"].push(shipCells);
          else if (count === 3)
            this.ships["three-deckers"].push(shipCells);
          else if (count === 2)
            this.ships["two-deckers"].push(shipCells);
          else if (count === 1)
            this.ships["one-deckers"].push(shipCells);
        }

      }

    }// while

    // Validate output
    if (result.hasOwnProperty("4") && result.hasOwnProperty("3") && result.hasOwnProperty("2") && result.hasOwnProperty("1"))
      return result;
    // Return default result if current result doesn't satisfy the rules
    return {
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    }
  }

}
