export interface Drone {
  id: number;
  isActive: boolean;
  position?: Position;
}

export interface Position {
  x: number;
  y: number;
}

export type Drones = Drone[];

export interface DronePosition {
  x: number;
  y: number;
}

export interface DamagedTree {
  x: number;
  y: number;
}

export interface Scan {
  dronePosition: DronePosition;
  damagedTrees: DamagedTree[];
}


