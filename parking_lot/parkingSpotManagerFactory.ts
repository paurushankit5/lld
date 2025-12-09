import { FourWheelerParkingSpotManager, TwoWheelerParkingSpotManager, ParkingSpotManager } from "./parkingSpotManager";
import { VehicleType } from "./vehicle";

export class ParkingSpotManagerFactory{

    twoWheelerParkingSpotManager : TwoWheelerParkingSpotManager;
    fourWheelerParkingSpotManager : FourWheelerParkingSpotManager;
    
    constructor(twoWheelerSpots: number = 2, fourWheelerSpots: number = 2){
        this.twoWheelerParkingSpotManager = new TwoWheelerParkingSpotManager(twoWheelerSpots);
        this.fourWheelerParkingSpotManager = new FourWheelerParkingSpotManager(fourWheelerSpots);
    }

    getParkingManager(vehicleType :VehicleType): ParkingSpotManager | null {
        switch (vehicleType){
            case VehicleType.TwoWheeler:
                return this.twoWheelerParkingSpotManager;
            case VehicleType.FourWheeler:
                return this.fourWheelerParkingSpotManager;
            default:
                return null;
        }
    }
}