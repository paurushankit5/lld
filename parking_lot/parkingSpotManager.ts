import { ParkingSpot, TwoWheelerParkingSpot, FourWheelerParkingSpot } from "./parkingSpot";
import { Vehicle } from "./vehicle";

export abstract class ParkingSpotManager{


    parkingSpots :ParkingSpot[]
    totalParkingSpot :number;
    bookedParkingSpot :number;

    constructor(parkinsSpotcount:number){
        this.parkingSpots = [];
        this.totalParkingSpot = 0;
        this.bookedParkingSpot = 0;
        this.setupParkingSpot(parkinsSpotcount);
    }

    abstract getParkingSpotObj();

    private setupParkingSpot(parkinsSpotcount :number){
        for(let i =0; i<parkinsSpotcount; i++){
            let parkingSpotObj = this.getParkingSpotObj();
            this.parkingSpots.push(parkingSpotObj);
            this.totalParkingSpot++;
        }
        
    }

   

    isParkingSpaceAvailable(){
        let diff = this.totalParkingSpot - this.bookedParkingSpot;
        if(diff > 0) return true;
        return false;
    }

    findParkingSpace(){
        if(!this.isParkingSpaceAvailable()){
            return null;
        }

        for(let parkingSpot of this.parkingSpots){
            if(parkingSpot.isEmpty){
                return parkingSpot;
            }
        }
        return null;
    }

    parkVehicle(vehicle :Vehicle, parkingSpot: ParkingSpot){
        if(parkingSpot.isEmpty){
            parkingSpot.bookSpot(vehicle);
            this.bookedParkingSpot++;
        }else{
            throw new Error("Parking SPot is not empty");
        }
    }

    removeVehicle(parkingSpot :ParkingSpot){
        if(!parkingSpot.isEmpty){
            parkingSpot.releaseSpot();
            this.bookedParkingSpot--;
        }else{
            throw new Error("Parking Spot is not empty");
        }
    }
}

export class TwoWheelerParkingSpotManager extends ParkingSpotManager{

    constructor(parkinsSpotcount : number){
        super(parkinsSpotcount);
    }

    getParkingSpotObj(){
        return new TwoWheelerParkingSpot();
    }


}

export class FourWheelerParkingSpotManager extends ParkingSpotManager{

    constructor(parkinsSpotcount : number){
        super(parkinsSpotcount);
    }

    getParkingSpotObj(){
        return new FourWheelerParkingSpot();
    }


}