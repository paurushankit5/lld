import { ParkingSpot } from "./parkingSpot";
import { Vehicle } from "./vehicle";

export class Ticket{

    id: string;
    entryTime: Date; // Public for demo purposes (can be made private with setter if needed)
    spot: ParkingSpot;
    vehicle: Vehicle;

    constructor(spot: ParkingSpot, vehicle: Vehicle){
        this.id = `TICKET-${Date.now()}`;
        this.entryTime = new Date();
        this.spot = spot;
        this.vehicle = vehicle;
    }

    getEntryTime(): Date {
        return this.entryTime;
    }

    getParkingSpot(): ParkingSpot {
        return this.spot;
    }

    getVehicle(): Vehicle {
        return this.vehicle;
    }
}