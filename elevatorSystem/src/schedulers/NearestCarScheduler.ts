import { CarCall, Direction, HallCall } from "../domain";
import { IElevator, IScheduler } from "../interfaces";

export class NearestCarScheduler implements IScheduler {
  name = "NearestCar";

  selectElevator(elevators: IElevator[], request: HallCall | CarCall): IElevator | null {
    if (elevators.length === 0) return null;
    let best: IElevator | null = null;
    let bestCost = Number.POSITIVE_INFINITY;
    for (const e of elevators) {
      const floor = request.type === "CarCall" ? request.floor : request.floor;
      const hint = request.type === "HallCall" ? request.direction : undefined;
      const base = e.estimateTimeToServe(floor, hint);
      // Small tie-breakers: idle preference, aligned direction preference
      let cost = base;
      if (e.isIdle()) cost *= 0.9;
      if (request.type === "HallCall" && e.getDirection() === request.direction) cost *= 0.95;
      if (cost < bestCost) {
        bestCost = cost;
        best = e;
      }
    }
    return best;
  }
}

export function nearestCar(): IScheduler {
  return new NearestCarScheduler();
}

