import { Injectable } from '@angular/core';
import { BattleshipService } from './battleship.service';
import { Status } from '../model/Status';

@Injectable({
  providedIn: 'root'
})
export class EnemyService extends BattleshipService {
  public cols: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

  public renderMove(id: string, availableCells: Array<string>, status: Status, battleStatsArray: Object): string {
    // Update cell
    this.updateCellState(id, status, battleStatsArray);
    // Remove the cell from availables
    availableCells.splice(availableCells.indexOf(id), 1);

    return id; // Return chosen cell
  }

  public getAvailableNearby(id: string, availableCells: Array<string>) {
        // Initialize directions to chose from
        let directions = {}

        // Get col and row from provided cell id
        let col: string = id[0];
        let row: number = +id.slice(1);
    
        // Get nearby cell for each direction if there is one
        let index = this.cols.indexOf(col); // get index of current column
        // ---Up
        let up = col + (row - 1).toString();
        if (row - 1 >= 0 && availableCells.indexOf(up) != -1)
          directions['up'] = up;
        // ---Down
        let down = col + (row + 1).toString();
        if (row + 1 <= 10 && availableCells.indexOf(down) != -1)
          directions['down'] = down;
        // ---Left
        let left = this.cols[index - 1] + row.toString();
        if (index - 1 >= 0 && availableCells.indexOf(left) != -1)
          directions['left'] = left;
        // ---Right
        let right = this.cols[index + 1] + row.toString()
        if (index + 1 <= 9 && availableCells.indexOf(right) != -1)
          directions['right'] = right;

        return directions;
    
  }

  public getRandomDirection(direction:object):string{
    let keys: string[] = Object.keys(direction);
    return this.getRandomMember(keys) as string;
  }

  public getRandomCellNearby(directions:object, direction: string = "up"): string {    
    if (!Object.keys(direction).length || !direction)
      return null;

    return directions[direction];
    
  }

  public markCell(id: string, status: Status, finishers: Array<string>, battleStatsArray): void {
    // Access cell status
    let cell = status.map[id];
    let type: string = cell['rel']['type'];
    let index: number = cell['rel']['index'];

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
      }
      // --- if it was fatal mark the entire ship as defeated
      if (finishers.indexOf(id) !== -1){
        this.markShipAsDefeated(type, index, status);
        this.updateBattlestate(id, status, battleStatsArray)
      }
    }
    
  }//markCell

}
