import { CarCall, Direction, HallCall } from "../domain";
import { IElevator, IScheduler } from "../interfaces";

// SCAN/LOOK-like scheduler: prefer cars moving towards the request in same direction and passing by
export class ScanScheduler implements IScheduler {
  name = "Scan";

  selectElevator(elevators: IElevator[], request: HallCall | CarCall): IElevator | null {
    if (elevators.length === 0) return null;
    const floor = request.type === "CarCall" ? request.floor : request.floor;
    const hallDir = request.type === "HallCall" ? request.direction : undefined;

    const candidatesPassing: IElevator[] = [];
    const candidatesIdle: IElevator[] = [];
    const others: IElevator[] = [];

    for (const e of elevators) {
      const dir = e.getDirection();
      const pos = e.getCurrentFloor();
      if (dir === Direction.Idle) {
        candidatesIdle.push(e);
      } else if (hallDir && dir === hallDir) {
        if ((dir === Direction.Up && pos <= floor) || (dir === Direction.Down && pos >= floor)) {
          candidatesPassing.push(e);
        } else {
          others.push(e);
        }
      } else {
        others.push(e);
      }
    }

    const score = (e: IElevator) => e.estimateTimeToServe(floor, hallDir);

    const pickBest = (arr: IElevator[]) => {
      if (arr.length === 0) return null;
      return arr.slice().sort((a, b) => score(a) - score(b))[0];
    };

    return pickBest(candidatesPassing) ?? pickBest(candidatesIdle) ?? pickBest(others);
  }
}

export function scan(): IScheduler {
  return new ScanScheduler();
}

