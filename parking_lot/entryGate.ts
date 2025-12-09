import { Vehicle } from "./vehicle";
import { ParkingSpotManagerFactory } from "./parkingSpotManagerFactory";
import { ParkingSpot } from "./parkingSpot";
import { Ticket } from "./ticket";

export class EntryGate{
    
    private parkingSpotManagerFactory: ParkingSpotManagerFactory;

    constructor(parkingSpotManagerFactory: ParkingSpotManagerFactory){
        this.parkingSpotManagerFactory = parkingSpotManagerFactory;
    }

    enterVehicle(vehicle: Vehicle): Ticket | null {
        // Find parking space
        const parkingSpot = this.findParkingSpace(vehicle);
        
        if (!parkingSpot) {
            console.log(`No parking space available for ${vehicle.vehicleType}`);
            return null;
        }

        // Book parking space
        const parkingManager = this.getParkingSpotManager(vehicle);
        if (parkingManager) {
            parkingManager.parkVehicle(vehicle, parkingSpot);
        }

        // Generate ticket
        const ticket = new Ticket(parkingSpot, vehicle);
        console.log(`Vehicle ${vehicle.vehicleNumber} entered. Ticket: ${ticket.id}`);
        return ticket;
    }

    findParkingSpace(vehicle: Vehicle): ParkingSpot | null {
        const parkingManager = this.getParkingSpotManager(vehicle);
        if (!parkingManager) {
            return null;
        }
        return parkingManager.findParkingSpace();
    }

    getParkingSpotManager(vehicle: Vehicle) {
        return this.parkingSpotManagerFactory.getParkingManager(vehicle.vehicleType);
    }
}