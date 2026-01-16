// User
// Select city
// Select Theatres in the city
// Select Movies in the theatres
// Select Date
// Select Showtimes
// Select Seat
// Reserve Seat
// Make Payment
// Book Ticket

// City
//     id
//     name

// Theatres
//     id
//     name
//     city

// Screens
//     id
//     theatre_id
//     name

// SeatCategory
//     id
//     name

// ScreenSeats

// Movies
//     id
//     name
//     release_date
//     genre

// Showtime
//     id
//     movie_id
//     screen_id
//     theatre_id
//     starttime
//     endtime

enum Genre {
    "ACTION" = "action",
    "COMEDY" = "comedy"
}
enum City {
    "PATNA" = "patna",
    "DELHI" = "delhi",
}

enum SeatCategory {
    "GOLD" = "GOLD",
    "SILVER" = "SILVER"
}

class User{
    public name;
    constructor(name: string){
        this.name = name;
    }
}


class Audi{
    public id : number;
    public name : string;
    public seats : Map<SeatCategory, Seat[]>;
    static counter=1;
    constructor( name: string ){
        this.id = Audi.counter++;
        this.name = name;
        this.seats = new Map();
    }

    addSeatsWithCategory(category : SeatCategory, seatCount : number){
        if(this.seats.has(category) || seatCount <= 0) throw Error("Invalid Request");
        const seats:Seat[] = [];
        for(let i = 1; i <= seatCount; i++){
            seats.push(new Seat(category));
        }
        this.seats.set(category, seats);
    }

    getSeats(){
        return this.seats;
    }
}

class Seat{
    public id : number;
    public name : string;
    public category : SeatCategory;
    static counter : number = 1;

    constructor(category : SeatCategory  ){
        this.id = Seat.counter++;
        this.name= `${category}-${this.id}`;
        this.category= category;
    }
}

class Theatre{
    public id: number;
    public city: City;
    public name: string;
    public audis : Audi[]
    static counter : number = 1;
    constructor( name: string,  city :City){
        this.id = Theatre.counter++;
        this.name = name;
        this.city = city;
        this.audis = []
    }

    addAudi( name: string ) : Audi{
        const audi = new Audi(name);
        this.audis.push(audi);
        return audi
    } 

    getAudis(){
        return this.audis;
    }
}

class Movie{
    public id :number;
    public name :string;
    public release_date: Date;
    public genre: Genre;
    static counter : number = 1;

    constructor(name : string, release_date : Date, genre : Genre){
        this.id = Movie.counter++;
        this.name = name;
        this.release_date = release_date;
        this.genre = genre;
    }

}



class Show{
    public id : number;
    public audi : Audi;
    public theatre : Theatre;
    public movie : Movie;
    public start_time : number;
    public end_time : number;
    static counter : number = 1;
    public bookedSeats : Seat[];
    constructor(theatre : Theatre,audi: Audi, movie: Movie, start_time : number, end_time: number){
        this.id = Show.counter++;
        this.audi = audi;
        this.theatre = theatre;
        this.movie = movie;
        this.start_time = start_time;
        this.end_time = end_time;
        this.bookedSeats = []
    }

    bookSeats(){

    }
}

class ShowSeat{}{
    constructor
}

class ShowManager {

    public shows : Show[];
    public moviesInTheatre : Map<Theatre, Set<Movie>>;
    constructor(){
        this.shows = []
        this.moviesInTheatre = new Map();
    }

    addShow(theatre: Theatre, audi : Audi, movie: Movie, start_time: number, end_time : number){
        const show = new Show(theatre, audi, movie, start_time, end_time);
        this.shows.push(show);
        this.updateMovieListForATheatre(theatre, movie);
    }

    private updateMovieListForATheatre(theatre : Theatre, movie: Movie){
        
        const movies = this.moviesInTheatre.get(theatre) ?? new Set<Movie>();
        movies.add(movie)
        this.moviesInTheatre.set(theatre, movies)
    }

    getMoviesByTheatre(theatre : Theatre){
        const movies = this.moviesInTheatre.get(theatre);
        return movies;
    }

    getShows(movie : Movie, theatre : Theatre, date : Date){

        return this.shows.filter((show) => {
            return show.theatre == theatre && show.movie == movie
        })
    }
}


class ticket {
     
}


class BookingManager{
    constructor(){

    }

    reserveSeat(){

    }
}

class MovieBooking{
    public theatres : Theatre[];
    public showManager : ShowManager;

    constructor(){
        this.theatres = [];
        this.showManager = new ShowManager();
    }

    addTheatre(name : string, city : City): Theatre{
        const theatre = new Theatre(name, city);
        this.theatres.push(theatre);
        return theatre;
    }

    getTheatres(city: City | null = null){
        if(!city) return this.theatres;
        return this.theatres.filter(theatre => theatre.city == city)
    }  
    
    addShow(theatre: Theatre, audi : Audi, movie: Movie, start_time: number, end_time : number){
        this.showManager.addShow(theatre, audi , movie, start_time, end_time );
    }

    getMoviesByTheatre(theatre : Theatre){
        return this.showManager.getMoviesByTheatre(theatre) ?? []
    }

    getShows(movie : Movie, theatre : Theatre, date : Date){
        return this.showManager.getShows(movie, theatre, date);
    }

}



async function run(){
    const obj = new MovieBooking();
    const th1 = obj.addTheatre("INOX", City.PATNA);
    const th2 = obj.addTheatre("CINEPIOLIS", City.PATNA);

    const ad1 = th1.addAudi("Audi1");
    const ad2 = th1.addAudi("Audi2");

    ad1.addSeatsWithCategory(SeatCategory.GOLD, 4);
    ad1.addSeatsWithCategory(SeatCategory.SILVER, 4);

    const mv1 = new Movie("DDLJ", new Date("2025-01-01") , Genre.ACTION)
    const mv2 = new Movie("KKKG", new Date("2025-01-01") , Genre.COMEDY)

    obj.addShow(th1,ad1,mv1, Date.now(), Date.now()+10800000)
    obj.addShow(th1,ad2,mv2, Date.now(), Date.now()+10800000)

    // console.log(obj.getMoviesByTheatre(th1));
    let shows = obj.getShows(mv2, th1, new Date("2025-01-01"))
    console.log(shows[0]);


}

run();

