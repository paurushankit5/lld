enum Genre {
    "COMEDY" = "Comedy",
    "ACTION" = "Action",
}

enum City{
    "PATNA" = "Patna",
    "DELHI" = "Delhi"
}

enum SeatCategory {
    "PREMIUM" = "Premium",
    "REGULAR" = "Regular",
}

class Movie{
    static counter: number = 1;
    public id : number;
    public name : string;
    public genre : Genre;
    public release_date : Date;
    constructor(name: string, genre : Genre, release_date : Date){
        this.id = Movie.counter++;
        this.name = name;
        this.genre = genre;
        this.release_date = release_date;
    }
}


class Theatre {
    static counter: number = 1;
    public id : number;
    public name : string;
    public city : City;
    public audis : Audi[];

    constructor(name : string, city :City){
        this.id = Theatre.counter++;
        this.name = name;
        this.city = city;
        this.audis = [];
    }

    addAudi(name : string){
        const audi = new Audi(name, this);
        this.audis.push(audi);
    }
}

class Audi{
    static counter: number = 1;
    public id : number;
    public name : string;
    public theatre : Theatre;
    public seats : Seat[];

    constructor(name: string, theatre : Theatre){
        this.id = Audi.counter++;
        this.name = name;
        this.theatre = theatre;
        this.seats = []
    }

    addSeats(){

    }

    private addSeat(){

    }

}

class Seat{
    static counter: number = 1;
    public id : number;
    public row : string;
    public seatNumber : number;
    public category : SeatCategory;

    constructor(row: string, seatNumber: number, category : SeatCategory){
         this.id = Seat.counter++;
         this.row = row;
         this.seatNumber = seatNumber;
         this.category = category;
    }
}


class Show{
    static counter: number = 1;
    public readonly id : number;
    public movie: Movie;
    public audi: Audi;
    public startTime : number;
    public endTime : number;

    constructor(movie : Movie, audi : Audi, startTime : number, endTime : number){
        this.id = Show.counter++;
        this.movie = movie;
        this.audi = audi;
        this.startTime = startTime;
        this.endTime = endTime;

    }
}

class ShowManager{

}

class BookingManager{

}

class MovieBooking{
 
}