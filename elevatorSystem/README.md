## Elevator System (TypeScript LLD)

This project implements a scalable, event-free (pull-driven) elevator system suitable for LLD interviews. It emphasizes clean separation of concerns (entities, scheduling policies, orchestration), pluggable strategies, and deterministic simulation.

### Goals
- Model multiple elevators, floors, hall calls, and car calls.
- Support different scheduling strategies (Nearest-Car, SCAN/LOOK).
- Keep logic testable and composable, with clear domain abstractions.
- Make timing explicit: travel time per floor, door dwell time, step-based simulation.

---

## Architecture and Design Decisions

- **Domain vs. Orchestration vs. Policy**
  - **Domain (`src/elevator.ts`, `src/domain.ts`)**: Elevator is a stateful entity with a minimal state machine (Idle/Moving/Doors Open) captured by fields (`direction`, `doorState`, `targetsUp/targetsDown`). It owns movement and stopping logic.
  - **Policy (`src/schedulers/*.ts`)**: Schedulers decide which elevator should serve a given request. They do not mutate elevator state directly—they select; the controller applies.
  - **Orchestration (`src/controller.ts`)**: Controller receives requests, asks a scheduler for an elevator, and assigns targets. It advances time for all elevators via `tick`.

- **Explicit Timing**
  - Two tunables per elevator: `speedMsPerFloor`, `doorDwellMs`. Step-based `tick(elapsedMs)` makes the simulator deterministic and easy to test/scale.

- **Target Management**
  - Targets are split into `targetsUp` and `targetsDown`. This mirrors SCAN-like logic and avoids costly resorting. Each `step` moves one floor at a time and opens doors if a target is reached.
  - Direction flipping happens only when the current direction queue empties—reduces thrashing and improves throughput.

- **Scheduling Strategies**
  - **NearestCar**: Minimizes estimated time-to-serve using an elevator-provided heuristic (`estimateTimeToServe`). Adds small tie-breakers for idleness and aligned direction.
  - **SCAN (LOOK-like)**: Prefers cars already moving toward and passing the request floor in the same direction, then idles, then others. Provides predictable, elevator-style batching.
  - Swappable at construction; easy to add new strategies without touching elevator/controller.

- **Estimation Heuristic**
  - Implementation balances simplicity and realism: consider current direction, remaining targets in that direction, possible turnaround, door dwell penalty if doors are already open, and straight-line travel distance.
  - This is deliberately modular; more advanced cost models (load factor, capacity, traffic patterns) can be plugged in later.

- **Scalability Considerations**
  - **Horizontal scaling**: The controller is stateless aside from elevator references; schedulers are pure functions. In distributed buildings/zones, shard by bank (group of elevators) or by floor range.
  - **Performance**: All decisions are O(number_of_elevators). With tens/hundreds of cars per bank, this remains cheap. If needed, pre-index elevators by direction/position to prune candidates quickly.
  - **Extensibility**:
    - Add capacity/load constraints by extending `IElevator` with `getLoad()` and factoring into cost.
    - Add time-of-day profiles (morning up-peak, evening down-peak) with profile-aware schedulers.
    - Add predictive dispatch: maintain demand statistics per floor to pre-position idle cars.
    - Integrate an event bus if needed; here we use a simple pull model to keep the LLD focused.

- **Correctness and Safety**
  - Floors are clamped to building limits.
  - Direction and door states are explicit enums; `strict` TypeScript.
  - Controller guards against missing elevators.

---

## Key Abstractions
- `IElevator`: State owner, exposes `addTargetFloor`, `step`, `estimateTimeToServe`, and telemetry.
- `IScheduler`: Strategy interface returning the best elevator for a request.
- `IController`: Handles requests, delegates to schedulers, advances time.

---

## Files
- `src/domain.ts`: Core types, enums, and config.
- `src/interfaces.ts`: Interface contracts for entities and strategies.
- `src/elevator.ts`: Elevator implementation with SCAN-like internal behavior.
- `src/schedulers/NearestCarScheduler.ts`: Greedy nearest-car scheduler.
- `src/schedulers/ScanScheduler.ts`: LOOK/SCAN-inspired scheduler.
- `src/controller.ts`: Multi-elevator orchestration.
- `src/simulation.ts`: Simple CLI simulation demo.

---

## Running the Demo

```bash
npm install
npm run build
npm start
```

You should see a time-stamped snapshot with each elevator’s floor, door state, direction, and pending targets. Try swapping schedulers in `src/simulation.ts` between `scan()` and `nearestCar()` to compare behavior.

---

## Possible Extensions
- Capacity and load-aware scheduling.
- Destination control (replace hall calls with destination entry on kiosks).
- Anti-bunching logic and pre-positioning policies.
- Safety modes and fault tolerance (out-of-service cars).
- Real-time UI or HTTP API around `ElevatorController`.

