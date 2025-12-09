import { ParkingSpotManagerFactory } from "./parkingSpotManagerFactory";
import { EntryGate } from "./entryGate";
import { ExitGate } from "./exitGate";
import { Vehicle, VehicleType } from "./vehicle";
import { Ticket } from "./ticket";

export class ParkingLot {
    private parkingSpotManagerFactory: ParkingSpotManagerFactory;
    private entryGate: EntryGate;
    private exitGate: ExitGate;
    private activeTickets: Map<string, Ticket>;

    constructor(twoWheelerSpots: number, fourWheelerSpots: number) {
        this.parkingSpotManagerFactory = new ParkingSpotManagerFactory(twoWheelerSpots, fourWheelerSpots);
        this.entryGate = new EntryGate(this.parkingSpotManagerFactory);
        this.exitGate = new ExitGate(this.parkingSpotManagerFactory);
        this.activeTickets = new Map();
    }

    parkVehicle(vehicle: Vehicle): Ticket | null {
        const ticket = this.entryGate.enterVehicle(vehicle);
        if (ticket) {
            this.activeTickets.set(ticket.id, ticket);
        }
        return ticket;
    }

    unparkVehicle(ticketId: string): number | null {
        const ticket = this.activeTickets.get(ticketId);
        if (!ticket) {
            console.log(`Ticket ${ticketId} not found`);
            return null;
        }
        
        const fee = this.exitGate.exitVehicle(ticket);
        this.activeTickets.delete(ticketId);
        return fee;
    }

    getAvailableSpots(vehicleType: VehicleType): number {
        const manager = this.parkingSpotManagerFactory.getParkingManager(vehicleType);
        if (!manager) return 0;
        return manager.totalParkingSpot - manager.bookedParkingSpot;
    }
}