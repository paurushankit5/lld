import { Direction, DoorState, ElevatorConfig, ElevatorId, Floor, clampFloor } from "./domain";
import { IElevator, ElevatorTelemetry } from "./interfaces";

export class Elevator implements IElevator {
  private readonly id: ElevatorId;
  private readonly speedMsPerFloor: number;
  private readonly doorDwellMs: number;
  private readonly minFloor: Floor;
  private readonly maxFloor: Floor;

  private currentFloor: Floor;
  private direction: Direction = Direction.Idle;
  private doorState: DoorState = DoorState.Closed;
  private dwellRemainingMs: number = 0;

  private targetsUp: Set<Floor> = new Set();
  private targetsDown: Set<Floor> = new Set();

  constructor(config: ElevatorConfig, minFloor: Floor, maxFloor: Floor) {
    this.id = config.id;
    this.speedMsPerFloor = config.speedMsPerFloor;
    this.doorDwellMs = config.doorDwellMs;
    this.minFloor = minFloor;
    this.maxFloor = maxFloor;
    this.currentFloor = clampFloor(config.startFloor ?? minFloor, minFloor, maxFloor);
  }

  getId(): ElevatorId { return this.id; }
  getCurrentFloor(): Floor { return this.currentFloor; }
  getDirection(): Direction { return this.direction; }
  getDoorState(): DoorState { return this.doorState; }
  isIdle(): boolean {
    return this.direction === Direction.Idle && this.targetsUp.size === 0 && this.targetsDown.size === 0 && this.doorState === DoorState.Closed;
  }
  getPendingTargets(): Floor[] {
    const ups = Array.from(this.targetsUp).sort((a, b) => a - b);
    const downs = Array.from(this.targetsDown).sort((a, b) => b - a);
    return [...ups, ...downs];
  }

  addTargetFloor(floor: Floor): void {
    const bounded = clampFloor(floor, this.minFloor, this.maxFloor);
    if (bounded > this.currentFloor) {
      this.targetsUp.add(bounded);
    } else if (bounded < this.currentFloor) {
      this.targetsDown.add(bounded);
    } else {
      // If we're at the floor, open doors (will be handled in step)
      if (this.isIdle()) {
        this.doorState = DoorState.Open;
        this.dwellRemainingMs = this.doorDwellMs;
      } else {
        // If moving, treat as a stop in the current direction if matching
        if (this.direction === Direction.Up) this.targetsUp.add(bounded);
        else if (this.direction === Direction.Down) this.targetsDown.add(bounded);
        else this.targetsUp.add(bounded);
      }
    }
    this.recomputeDirection();
  }

  private recomputeDirection(): void {
    if (this.targetsUp.size === 0 && this.targetsDown.size === 0) {
      this.direction = Direction.Idle;
      return;
    }
    if (this.direction === Direction.Idle) {
      // choose closest target direction
      const closestUp = this.closestUp();
      const closestDown = this.closestDown();
      if (closestUp === null) this.direction = Direction.Down;
      else if (closestDown === null) this.direction = Direction.Up;
      else {
        const upDist = Math.abs(closestUp - this.currentFloor);
        const downDist = Math.abs(closestDown - this.currentFloor);
        this.direction = upDist <= downDist ? Direction.Up : Direction.Down;
      }
      return;
    }
    // Keep current direction if there are still targets ahead
    if (this.direction === Direction.Up && this.hasUpTargetsAbove()) return;
    if (this.direction === Direction.Down && this.hasDownTargetsBelow()) return;
    // Switch direction if no more in current direction
    this.direction = this.direction === Direction.Up ? Direction.Down : Direction.Up;
  }

  private closestUp(): Floor | null {
    const ups = Array.from(this.targetsUp).filter(f => f >= this.currentFloor);
    if (ups.length === 0) return null;
    return ups.sort((a, b) => a - b)[0];
  }
  private closestDown(): Floor | null {
    const downs = Array.from(this.targetsDown).filter(f => f <= this.currentFloor);
    if (downs.length === 0) return null;
    return downs.sort((a, b) => b - a)[0];
  }
  private hasUpTargetsAbove(): boolean {
    for (const f of this.targetsUp) if (f > this.currentFloor) return true;
    return false;
  }
  private hasDownTargetsBelow(): boolean {
    for (const f of this.targetsDown) if (f < this.currentFloor) return true;
    return false;
  }

  step(elapsedMs: number): void {
    // Handle door dwell
    if (this.doorState === DoorState.Open) {
      this.dwellRemainingMs -= elapsedMs;
      if (this.dwellRemainingMs <= 0) {
        this.doorState = DoorState.Closed;
        this.dwellRemainingMs = 0;
        this.recomputeDirection();
      }
      return;
    }

    if (this.direction === Direction.Idle) {
      // If idle but have targets, pick direction
      this.recomputeDirection();
      if (this.direction === Direction.Idle) return;
    }

    // Accumulate travel; move one floor per speedMsPerFloor
    let remaining = elapsedMs;
    while (remaining >= this.speedMsPerFloor) {
      if (this.direction === Direction.Up) {
        this.currentFloor = clampFloor(this.currentFloor + 1, this.minFloor, this.maxFloor);
        // Stop if this is a target
        if (this.targetsUp.has(this.currentFloor)) {
          this.targetsUp.delete(this.currentFloor);
          this.arriveAndOpenDoors();
          break;
        }
        // If overshot and no more ups, flip direction
        if (!this.hasUpTargetsAbove() && this.targetsUp.size === 0 && this.targetsDown.size > 0) {
          this.direction = Direction.Down;
        }
      } else if (this.direction === Direction.Down) {
        this.currentFloor = clampFloor(this.currentFloor - 1, this.minFloor, this.maxFloor);
        if (this.targetsDown.has(this.currentFloor)) {
          this.targetsDown.delete(this.currentFloor);
          this.arriveAndOpenDoors();
          break;
        }
        if (!this.hasDownTargetsBelow() && this.targetsDown.size === 0 && this.targetsUp.size > 0) {
          this.direction = Direction.Up;
        }
      }
      remaining -= this.speedMsPerFloor;
    }

    // If no targets left, idle
    if (this.targetsUp.size === 0 && this.targetsDown.size === 0 && this.doorState === DoorState.Closed) {
      this.direction = Direction.Idle;
    }
  }

  private arriveAndOpenDoors(): void {
    this.doorState = DoorState.Open;
    this.dwellRemainingMs = this.doorDwellMs;
    // Decide next direction after doors close via recompute
  }

  estimateTimeToServe(floor: Floor, directionHint?: Direction): number {
    // Simple heuristic based on SCAN: time to finish current direction, then to floor
    if (this.isIdle()) {
      const distance = Math.abs(this.currentFloor - floor);
      return distance * this.speedMsPerFloor;
    }
    // Clone state summary
    const current = this.currentFloor;
    const dir = this.direction;
    const ups = Array.from(this.targetsUp);
    const downs = Array.from(this.targetsDown);
    const doorPenalty = this.doorState === DoorState.Open ? this.dwellRemainingMs : 0;

    const travel = (a: Floor, b: Floor) => Math.abs(a - b) * this.speedMsPerFloor;
    const max = (arr: number[], def: number) => (arr.length ? Math.max(...arr) : def);
    const min = (arr: number[], def: number) => (arr.length ? Math.min(...arr) : def);

    let timeMs = doorPenalty;
    if (dir === Direction.Up) {
      const lastUp = Math.max(max(ups, current), current);
      timeMs += travel(current, lastUp);
      // return trip down if needed
      if (downs.length) {
        const lastDown = min(downs, lastUp);
        timeMs += travel(lastUp, lastDown);
        timeMs += travel(lastDown, floor);
      } else {
        timeMs += travel(lastUp, floor);
      }
    } else if (dir === Direction.Down) {
      const lastDown = Math.min(min(downs, current), current);
      timeMs += travel(current, lastDown);
      if (ups.length) {
        const lastUp = max(ups, lastDown);
        timeMs += travel(lastDown, lastUp);
        timeMs += travel(lastUp, floor);
      } else {
        timeMs += travel(lastDown, floor);
      }
    } else {
      timeMs += travel(current, floor);
    }

    // Favor aligned direction slightly if hint is provided
    if (directionHint && directionHint === dir) {
      timeMs *= 0.9;
    }
    return timeMs;
  }

  toTelemetry(): ElevatorTelemetry {
    return {
      id: this.id,
      currentFloor: this.currentFloor,
      direction: this.direction,
      doorState: this.doorState,
      pendingTargets: this.getPendingTargets(),
      isIdle: this.isIdle()
    };
  }
}

export function createElevator(config: ElevatorConfig, minFloor: Floor, maxFloor: Floor): IElevator {
  return new Elevator(config, minFloor, maxFloor);
}

