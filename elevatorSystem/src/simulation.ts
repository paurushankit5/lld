import { BuildingConfig, Direction, ElevatorConfig } from "./domain";
import { ElevatorController } from "./controller";
import { createElevator } from "./elevator";
import { nearestCar } from "./schedulers/NearestCarScheduler";
import { scan } from "./schedulers/ScanScheduler";

function demo(): void {
  const building: BuildingConfig = { numFloors: 20, minFloor: 1, maxFloor: 20 };
  const elevs: ElevatorConfig[] = [
    { id: 1, speedMsPerFloor: 800, doorDwellMs: 1200, startFloor: 1 },
    { id: 2, speedMsPerFloor: 800, doorDwellMs: 1200, startFloor: 10 },
    { id: 3, speedMsPerFloor: 800, doorDwellMs: 1200, startFloor: 20 }
  ];

  // Swap between schedulers here:
  const controller = new ElevatorController(building, elevs, createElevator, scan());
  console.log(`Scheduler: ${controller.getSchedulerName()}`);

  // Issue some hall calls
  controller.submitHallCall({ type: "HallCall", floor: 3, direction: Direction.Up });
  controller.submitHallCall({ type: "HallCall", floor: 15, direction: Direction.Down });
  controller.submitHallCall({ type: "HallCall", floor: 8, direction: Direction.Up });

  // Run a simple time simulation
  const stepMs = 400;
  for (let t = 0; t <= 25000; t += stepMs) {
    if (t === 6000) {
      // Mid-run additional calls
      controller.submitHallCall({ type: "HallCall", floor: 1, direction: Direction.Up });
      controller.submitHallCall({ type: "HallCall", floor: 18, direction: Direction.Down });
    }
    controller.tick(stepMs);
    if (t % 1600 === 0) {
      const snapshot = controller.getElevatorsTelemetry();
      const line = snapshot
        .map(s => `E${s.id}@${s.currentFloor}${s.doorState === "Open" ? "(open)" : ""}:${s.direction[0]}[${s.pendingTargets.join(",")}]`)
        .join(" | ");
      console.log(`${String(t).padStart(5, " ")}ms  ${line}`);
    }
  }
}

if (require.main === module) {
  demo();
}

