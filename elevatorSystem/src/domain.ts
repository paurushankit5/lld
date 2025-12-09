export type ElevatorId = number;
export type Floor = number;

export enum Direction {
  Up = "Up",
  Down = "Down",
  Idle = "Idle"
}

export enum DoorState {
  Open = "Open",
  Closed = "Closed"
}

export interface HallCall {
  type: "HallCall";
  floor: Floor;
  direction: Exclude<Direction, Direction.Idle>;
  createdAtMs?: number;
}

export interface CarCall {
  type: "CarCall";
  elevatorId: ElevatorId;
  floor: Floor;
  createdAtMs?: number;
}

export type Request = HallCall | CarCall;

export interface BuildingConfig {
  numFloors: number;
  minFloor?: Floor;
  maxFloor?: Floor;
}

export interface ElevatorConfig {
  id: ElevatorId;
  speedMsPerFloor: number; // travel time per floor
  doorDwellMs: number; // time doors stay open at a stop
  startFloor?: Floor;
}

export function clampFloor(floor: Floor, minFloor: Floor, maxFloor: Floor): Floor {
  if (floor < minFloor) return minFloor;
  if (floor > maxFloor) return maxFloor;
  return floor;
}

