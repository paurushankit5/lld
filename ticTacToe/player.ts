import { Piece } from "./piece";

export class Player{
    private name :string;
    private piece : Piece;

    constructor(name :string,  piece : piece){
        this.name = name;
        this.piece = piece;
    }

    getName(){
        return this.name;
    }

    getPiece(){
        return this.piece;
    }
}