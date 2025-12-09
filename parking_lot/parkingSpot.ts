import { v4 as uuidv4 } from 'uuid';
import { Vehicle, VehicleType } from "./vehicle";


export abstract class ParkingSpot{


    id :string;
    isEmpty :boolean;
    vehicle :Vehicle | null;
    vehicleType :VehicleType;
    price :number;


    constructor(vehicleType : VehicleType){
        this.id = uuidv4();        
        this.isEmpty = true;
        this.vehicle = null;
        this.price = 0;
        this.vehicleType = vehicleType;
        this.setPrice();
    }
    
   

    bookSpot(vehicle: Vehicle){
        this.isEmpty = false;
        this.vehicle = vehicle;
        console.log(`Parking spot booked`)
    }

    releaseSpot(){
        this.isEmpty = true;
        this.vehicle = null;
        console.log(`Parking spot released`)
    }

    abstract setPrice();
}

export class FourWheelerParkingSpot extends ParkingSpot{

    constructor(){
        super(VehicleType.FourWheeler);
    }

    setPrice() {
        this.price = 20;
    }
}

export class TwoWheelerParkingSpot extends ParkingSpot{
    

    constructor(){
        super(VehicleType.TwoWheeler);
    }

    setPrice() {
        this.price = 10;
    }
}