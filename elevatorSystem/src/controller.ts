import { BuildingConfig, CarCall, Direction, ElevatorConfig, HallCall } from "./domain";
import { ElevatorFactory, ElevatorTelemetry, IController, IElevator, IScheduler } from "./interfaces";

export class ElevatorController implements IController {
  private readonly minFloor: number;
  private readonly maxFloor: number;
  private readonly elevators: IElevator[];
  private readonly scheduler: IScheduler;

  constructor(
    building: BuildingConfig,
    elevatorConfigs: ElevatorConfig[],
    elevatorFactory: ElevatorFactory,
    scheduler: IScheduler
  ) {
    this.minFloor = building.minFloor ?? 1;
    this.maxFloor = building.maxFloor ?? building.numFloors;
    this.scheduler = scheduler;
    this.elevators = elevatorConfigs.map(cfg => elevatorFactory(cfg, this.minFloor, this.maxFloor));
  }

  getSchedulerName(): string {
    return this.scheduler.name;
  }

  submitHallCall(request: HallCall): void {
    const elevator = this.scheduler.selectElevator(this.elevators, request);
    if (!elevator) return;
    elevator.addTargetFloor(request.floor);
  }

  submitCarCall(request: CarCall): void {
    const elevator = this.elevators.find(e => e.getId() === request.elevatorId);
    if (!elevator) return;
    elevator.addTargetFloor(request.floor);
  }

  tick(elapsedMs: number): void {
    for (const e of this.elevators) {
      e.step(elapsedMs);
    }
  }

  getElevatorsTelemetry(): ElevatorTelemetry[] {
    return this.elevators.map(e => e.toTelemetry());
  }
}

