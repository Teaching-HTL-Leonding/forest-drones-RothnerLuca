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
  closestDamagedTrees?: DamagedTree[] = [];
  userPosX: number;
  userPosY: number;
  lastUserPosX: number;
  lastUserPosY: number;

  constructor(public api: DroneLogicService) {
    this.userPosX = 0;
    this.userPosY = 0;
    this.lastUserPosX = 0;
    this.lastUserPosY = 0;
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

  public userPosOnChange() :void {
    if (this.userPosX > 750) {
      console.log('> 750')
      this.userPosX = 750;
    } else if (this.userPosX < -750) {
      this.userPosX = -750;
    }

    if (this.userPosY > 750) {
      this.userPosY = 750;
    } else if (this.userPosY < -750) {
      this.userPosY = -750;
    }
  }

  public flyToUserAndScanArea(id: number): void {
    this.api.flyTo(id, this.userPosX, this.userPosY).subscribe(() => {
      this.lastUserPosX = this.userPosX;
      this.lastUserPosY = this.userPosY;
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

        let isInArray = false;
        this.damagedTrees.forEach((tree) => {
          if (this.getDistanceToTree(tree.x, tree.y) < 100) {
            this.closestDamagedTrees?.forEach((t) => {
              if (t.x === tree.x && t.y === tree.y) {
                isInArray = true;
              }
            });
            if (!isInArray) this.closestDamagedTrees?.push(tree);
            this.damagedTrees = this.damagedTrees?.filter((t) => t.x !== tree.x || t.y !== tree.y);
          }
        });

        this.closestDamagedTrees = this.closestDamagedTrees?.filter((tree) => this.getDistanceToTree(tree.x, tree.y) <= 100);
      });
      this.ngOnInit();
     });
  }

  public reloadNeeded(): boolean {
    if (this.lastUserPosX !== this.userPosX || this.lastUserPosY !== this.userPosY) {
      return true;
    }
    return false;
  }

  public markAsExamined(x: number, y: number): void {
    this.api.markAsExamined(x, y).subscribe();
    this.damagedTrees = this.damagedTrees?.filter((el) => el.x !== x || el.y !== y);
    this.closestDamagedTrees = this.closestDamagedTrees?.filter((el) => el.x !== x || el.y !== y);
  }

  public getDistanceToTree(treePosX: number, treePosY: number): number {
    return Math.abs(this.userPosX - treePosX) + Math.abs(this.userPosY - treePosY);
  }
}
