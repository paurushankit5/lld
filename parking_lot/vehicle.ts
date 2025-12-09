export abstract class Vehicle{

    vehicleNumber :string;
    vehicleType :VehicleType;
    constructor(vehicleNumber: string, vehicleType: VehicleType){
        this.vehicleNumber  = vehicleNumber;
        this.vehicleType  = vehicleType;
    }
}

export class TwoWheeler extends Vehicle{
    constructor(vehicleNumber: string){
        super(vehicleNumber, VehicleType.TwoWheeler)
    }
}


export class FourWheeler extends Vehicle{
    constructor(vehicleNumber: string){
        super(vehicleNumber, VehicleType.FourWheeler)
    }
}


export enum VehicleType {
    TwoWheeler = 'TwoWheeler',
    FourWheeler = 'FourWheeler'
}