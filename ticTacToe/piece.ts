export abstract class Piece{

    symbol :string;
    constructor(symbol :string){
        this.symbol = symbol;
    }

    getSymbol(){
        return this.symbol;
    }
}

export class X extends Piece{

    constructor(){
        super("X");
    }
}

export class O extends Piece{
    
    constructor(){
        super("O");
    }

}