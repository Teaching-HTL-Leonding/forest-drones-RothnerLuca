import { Component, OnInit } from '@angular/core';
import { DamagedTree, Drones, Position, Scan } from './api-interfaces';
import { DroneLogicService } from './drone-logic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  dronesFromServer?: Drones;
  scanResponse?: Scan;
  damagedTrees?: DamagedTree[];
  userPosX: number;
  userPosY: number;

  constructor(public api: DroneLogicService) {
    this.userPosX = 0;
    this.userPosY = 0;
   }

  ngOnInit(): void {
    this.api.getDrones().subscribe((data) => {
      this.dronesFromServer = data;
    });
  }

  public activateDrone(id: number): void {
    this.api.activeDrone(id).subscribe(() => this.ngOnInit());
  }

  public shutdownDrone(id: number): void {
    this.api.shutdownDrone(id).subscribe(() => this.ngOnInit());
  }

  public updateUserPos(x: number, y: number): void {
    if (x > 750) {
      x = 750;
    } else if (x < -750) {
      x = -750;
    }

    if (y > 750) {
      y = 750;
    } else if (y < -750) {
      y = -750;
    }

    this.userPosX = x;
    this.userPosY = y;
  }

  public flyTo(id: number, x: number, y: number): void {
    this.api.flyTo(id, x, y).subscribe(() => {
      this.ngOnInit();
     });
  }

  public scanArea(id: number): void {
    this.api.scanArea(id).subscribe((data) => {
      if (!this.damagedTrees) {
        this.damagedTrees = data.damagedTrees;
      } else {
        let alreadyIn = false;
        data.damagedTrees.forEach((scanTree) => {
          this.damagedTrees?.forEach((damagedTree) => {
            if (scanTree.x === damagedTree.x && scanTree.y === damagedTree.y) {
              alreadyIn = true;
            }
          });
          if (!alreadyIn) {
            this.damagedTrees?.push(scanTree);
            alreadyIn = false;
          }
        });
      }
    });
  }

  public markAsExamined(x: number, y: number): void {
    this.api.markAsExamined(x, y).subscribe();
    this.damagedTrees = this.damagedTrees?.filter((el) => el.x !== x && el.y !== y);
  }
}
