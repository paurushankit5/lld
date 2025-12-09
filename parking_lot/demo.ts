import { ParkingLot } from "./parkingLot";
import { TwoWheeler, FourWheeler } from "./vehicle";
import { VehicleType } from "./vehicle";

// Demo of the Parking Lot System
function main() {
    console.log("=== Parking Lot System Demo ===\n");

    // Initialize parking lot with 3 two-wheeler spots and 2 four-wheeler spots
    const parkingLot = new ParkingLot(3, 2);
    
    console.log("Initial state:");
    console.log(`Available Two-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.TwoWheeler)}`);
    console.log(`Available Four-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.FourWheeler)}\n`);

    // Park some vehicles
    console.log("--- Parking Vehicles ---");
    const bike1 = new TwoWheeler("BIKE-001");
    const ticket1 = parkingLot.parkVehicle(bike1);
    
    const bike2 = new TwoWheeler("BIKE-002");
    const ticket2 = parkingLot.parkVehicle(bike2);
    
    const car1 = new FourWheeler("CAR-001");
    const ticket3 = parkingLot.parkVehicle(car1);
    
    const car2 = new FourWheeler("CAR-002");
    const ticket4 = parkingLot.parkVehicle(car2);
    
    const bike3 = new TwoWheeler("BIKE-003");
    const ticket5 = parkingLot.parkVehicle(bike3);
    
    console.log("\nCurrent state:");
    console.log(`Available Two-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.TwoWheeler)}`);
    console.log(`Available Four-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.FourWheeler)}\n`);

    // Try to park when full
    console.log("--- Attempting to park when full ---");
    const bike4 = new TwoWheeler("BIKE-004");
    const ticket6 = parkingLot.parkVehicle(bike4); // Should fail - no spots available
    
    // Simulate time passing by manually setting entry time (for demo purposes)
    console.log("\n--- Simulating 2 hours of parking ---");
    
    // Exit vehicles
    console.log("\n--- Exiting Vehicles ---");
    if (ticket1) {
        // Manually adjust entry time for demo (2 hours ago)
        ticket1.entryTime = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const fee1 = parkingLot.unparkVehicle(ticket1.id);
        console.log(`Fee for ${bike1.vehicleNumber}: $${fee1}\n`);
    }
    
    if (ticket3) {
        // Manually adjust entry time for demo (2 hours ago)
        ticket3.entryTime = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const fee3 = parkingLot.unparkVehicle(ticket3.id);
        console.log(`Fee for ${car1.vehicleNumber}: $${fee3}\n`);
    }
    
    console.log("Final state:");
    console.log(`Available Two-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.TwoWheeler)}`);
    console.log(`Available Four-Wheeler spots: ${parkingLot.getAvailableSpots(VehicleType.FourWheeler)}`);
}

main();

