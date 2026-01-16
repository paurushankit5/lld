// Functional Requirement
//     Add Parking Lot
//     Assign slots for each vehicletype 
//     User enters to parking lot with a Vehicle
//     Allocate a parking lot based on some policy.
//     Assign ticket with startTime;
//     At exit, get endtime and calculate price based on some strategy
//     nake paymnet and exit Vehicle

// Actors
//     Vehicle - TWO Wheeler | Car | Bus
//     Parking Lot
//     Parking spot for each vehcileType
//     Ticket
//     Price
//     Payment


enum VehicleType {
  CAR = 'car',
  BIKE = 'bike',
//   TRUCK = 'truck'
}

abstract class Vehicle{
    // type: string;
    constructor(public type: VehicleType, public vehNumber : string){

    }
}

class Car extends Vehicle{
    constructor(vehNumber: string){
        super(VehicleType.CAR, vehNumber);
    }
}

class Bike extends Vehicle{
    constructor(vehNumber : string){
        super(VehicleType.BIKE, vehNumber);
    }
}

class ParkingSpot{
    public isOccupied : boolean;
    public vehicle: Vehicle | null;
    public type: VehicleType;
    constructor(public id: string, type: VehicleType){
        this.type = type
        this.isOccupied = false;
        this.vehicle = null;
    }


    placeVehicle(vehicle : Vehicle){
        this.vehicle = vehicle
        this.isOccupied = true;
        console.log(`${vehicle.vehNumber} is parked on spot ${this.id}`)
    }

    removeVehicle(){
        if(!this.vehicle) throw new Error("Invalid Request");
        console.log(`${this.vehicle.vehNumber} is removed from spot ${this.id}`)

        this.vehicle = null;
        this.isOccupied = false;
    } 
}


class ParkingSpotsData{
    public spots : ParkingSpot[];
    public count :  number;
    constructor(count: number, type: VehicleType ){
        this.spots = [];
        this.count = count;
        this.addSpots(type);
    }

    addSpots(type: VehicleType){
        for(let i =1 ; i <= this.count ; i++ ){
            this.spots.push(new ParkingSpot(`${type}-${i}`, type));
        }
    }
}

class ParkingSpotManager{
    public parkingSpots : Map<VehicleType ,  ParkingSpotsData>
    constructor(){
        this.parkingSpots = new Map();
    }

    addSpots(type : VehicleType, totalSpotCount : number) : void{
        switch(type){
            case VehicleType.CAR : 
                this.parkingSpots.set(VehicleType.CAR ,new ParkingSpotsData(totalSpotCount, type));
            break;
            case VehicleType.BIKE : 
                this.parkingSpots.set(VehicleType.CAR ,new ParkingSpotsData(totalSpotCount, type));
            break;
        }
    }

    getAvailableParkingSpot(type : VehicleType){
        let data = this.parkingSpots.get(type)

        if(data){
            let allSpots = data.spots;
            if(allSpots.length){
                for(let i=0; i< allSpots.length; i++){
                    if(!allSpots[i].isOccupied){
                        return allSpots[i];
                    }
                }
            }

        }
        return null;
    }   
}

class Ticket{
    static id = 1;
    public entryTime: number;
    public exitTime: number | null;
    public vehicle : Vehicle;
    public parkingSpot : ParkingSpot;

    constructor(entryTime : number, vehicle : Vehicle, parkingSpot : ParkingSpot ){
        this.entryTime = entryTime
        this.exitTime = null
        this.vehicle = vehicle
        this.parkingSpot = parkingSpot
    }

    setExitTime(exitTime: number){
        this.exitTime = exitTime
    }

    
}


class ParkingLot{
    public manager : ParkingSpotManager;
    // public unpaidTicket : Ticket[]
    // public paidTicket : Ticket[]
    
    constructor(){
        this.manager = new ParkingSpotManager();
        // this.unpaidTicket = []
        // this.paidTicket = []
    }

    addSpots(type: VehicleType, count: number){
        this.manager.addSpots(type, count);
    }

    enter(vehicle: Vehicle) : Ticket | null{
        // get vehicle type
        // find available parkingspot
        // assign ticket
        // park vehicle
        let spot = this.manager.getAvailableParkingSpot(vehicle.type)
        if(!spot){
            console.log(`No Spots available for ${vehicle.type}`)
            return null;
        }
        let ticket = this.assignTicket(vehicle, spot);
        spot.placeVehicle(vehicle)
        return ticket;
    }

    exit(ticket: Ticket){
        // extract spot and vehicle
        // calculate price
        // make paymnet
        // free up spot
        // exit vehicle

        if(ticket.exitTime ) throw new Error("Invalid Ticket");
        let exitTime = Date.now();
        let duration = exitTime - ticket.entryTime;
        let price = this.calculatePrice(duration, ticket.vehicle.type);
        console.log(`Final price will be ${price} for the ticket`)
        ticket.parkingSpot.removeVehicle();
        ticket.setExitTime(exitTime);

    }

    private assignTicket(vehicle : Vehicle, spot: ParkingSpot){
        let ticket = new Ticket(Date.now(), vehicle , spot);
        return ticket;
    }

    private calculatePrice(duration: number, type: VehicleType){
        return 100;
    }


}

async function delay(ms:number) {
    return new Promise( resolve => setTimeout(resolve, ms))
}

async function run(){
    const lot = new ParkingLot();
    lot.addSpots(VehicleType.CAR, 3);
    const car1 = new Car("KA53E1993");
    let ticket1 = lot.enter(car1);
    console.log(ticket1)

    await delay(3000);
    if(ticket1) lot.exit(ticket1);
 

}

run();





