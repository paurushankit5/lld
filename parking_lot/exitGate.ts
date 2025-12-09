import { Ticket } from "./ticket";
import { ParkingSpotManagerFactory } from "./parkingSpotManagerFactory";
import { PaymentCalculator } from "./paymentCalculator";

export class ExitGate {
    
    private parkingSpotManagerFactory: ParkingSpotManagerFactory;
    private paymentCalculator: PaymentCalculator;

    constructor(parkingSpotManagerFactory: ParkingSpotManagerFactory) {
        this.parkingSpotManagerFactory = parkingSpotManagerFactory;
        this.paymentCalculator = new PaymentCalculator();
    }

    exitVehicle(ticket: Ticket): number {
        const vehicle = ticket.getVehicle();
        const parkingSpot = ticket.getParkingSpot();
        const entryTime = ticket.getEntryTime();
        
        // Calculate parking fee
        const parkingFee = this.paymentCalculator.calculateFee(entryTime, parkingSpot.price);
        
        // Remove vehicle from parking spot
        const parkingManager = this.parkingSpotManagerFactory.getParkingManager(vehicle.vehicleType);
        if (parkingManager) {
            parkingManager.removeVehicle(parkingSpot);
        }
        
        console.log(`Vehicle ${vehicle.vehicleNumber} exited. Parking fee: $${parkingFee}`);
        return parkingFee;
    }
}

