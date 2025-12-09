import { CarCall, Direction, DoorState, ElevatorConfig, ElevatorId, Floor, HallCall, Request } from "./domain";

export interface ElevatorTelemetry {
  id: ElevatorId;
  currentFloor: Floor;
  direction: Direction;
  doorState: DoorState;
  pendingTargets: Floor[];
  isIdle: boolean;
}

export interface IElevator {
  getId(): ElevatorId;
  getCurrentFloor(): Floor;
  getDirection(): Direction;
  getDoorState(): DoorState;
  getPendingTargets(): Floor[];
  isIdle(): boolean;
  addTargetFloor(floor: Floor): void;
  step(elapsedMs: number): void;
  estimateTimeToServe(floor: Floor, directionHint?: Direction): number;
  toTelemetry(): ElevatorTelemetry;
}

export interface IScheduler {
  name: string;
  selectElevator(elevators: IElevator[], request: HallCall | CarCall): IElevator | null;
}

export interface IController {
  submitHallCall(request: HallCall): void;
  submitCarCall(request: CarCall): void;
  tick(elapsedMs: number): void;
  getElevatorsTelemetry(): ElevatorTelemetry[];
  getSchedulerName(): string;
}

export type ElevatorFactory = (config: ElevatorConfig, minFloor: Floor, maxFloor: Floor) => IElevator;

