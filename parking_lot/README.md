# Parking Lot System - Low Level Design

A complete parking lot management system implementation in TypeScript, designed for LLD interviews.

## System Architecture

### Core Components

1. **Vehicle** - Abstract base class for vehicles
   - `TwoWheeler` - Motorcycles, scooters
   - `FourWheeler` - Cars, SUVs

2. **ParkingSpot** - Abstract base class for parking spots
   - `TwoWheelerParkingSpot` - $10/hour
   - `FourWheelerParkingSpot` - $20/hour

3. **ParkingSpotManager** - Manages parking spots for a vehicle type
   - `TwoWheelerParkingSpotManager` - Manages two-wheeler spots
   - `FourWheelerParkingSpotManager` - Manages four-wheeler spots

4. **ParkingSpotManagerFactory** - Factory to get appropriate manager based on vehicle type

5. **EntryGate** - Handles vehicle entry
   - Finds available parking spot
   - Books the spot
   - Generates parking ticket

6. **ExitGate** - Handles vehicle exit
   - Calculates parking fee
   - Releases parking spot

7. **PaymentCalculator** - Calculates parking fees based on time

8. **Ticket** - Represents a parking ticket with entry time, spot, and vehicle

9. **ParkingLot** - Main orchestrator class that coordinates all components

## Design Patterns Used

- **Strategy Pattern**: Different parking spot managers for different vehicle types
- **Factory Pattern**: ParkingSpotManagerFactory creates appropriate managers
- **Abstract Factory**: ParkingSpot abstract class with concrete implementations
- **Template Method**: Abstract methods in base classes

## Features

- ✅ Support for multiple vehicle types (Two-wheeler, Four-wheeler)
- ✅ Dynamic parking spot allocation
- ✅ Ticket generation on entry
- ✅ Fee calculation based on parking duration
- ✅ Availability checking
- ✅ Proper spot management and release

## Usage

```typescript
import { ParkingLot } from "./parkingLot";
import { TwoWheeler, FourWheeler } from "./vehicle";

// Create parking lot with 3 two-wheeler spots and 2 four-wheeler spots
const parkingLot = new ParkingLot(3, 2);

// Park a vehicle
const bike = new TwoWheeler("BIKE-001");
const ticket = parkingLot.parkVehicle(bike);

// Exit vehicle
if (ticket) {
    const fee = parkingLot.unparkVehicle(ticket.id);
    console.log(`Parking fee: $${fee}`);
}

// Check availability
const available = parkingLot.getAvailableSpots(VehicleType.TwoWheeler);
```

## Running the Demo

```bash
# Install dependencies
npm install

# Run demo
npm run demo

# Or compile and run
npm run build
npm start
```

## File Structure

```
parking_lot/
├── vehicle.ts                 # Vehicle classes and types
├── parkingSpot.ts            # Parking spot classes
├── parkingSpotManager.ts     # Parking spot managers
├── parkingSpotManagerFactory.ts  # Factory for managers
├── ticket.ts                 # Ticket class
├── entryGate.ts             # Entry gate logic
├── exitGate.ts              # Exit gate logic
├── paymentCalculator.ts     # Payment calculation
├── parkingLot.ts            # Main parking lot class
├── demo.ts                  # Demo/example usage
└── package.json             # Dependencies
```

