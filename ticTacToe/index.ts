import { Game } from "./game";
import { Board } from "./board";
import { O, X } from "./piece";
import { Player } from "./player";

class Start{
    play (){
        let board = new Board(3,3,3);
        let game = new Game(board);
        
        game.addPlayer(new Player('Ram', new X()));
        game.addPlayer(new Player('Shyam', new O()));
        game.getBoard().displayBoard();
        game.play(0,0);
        game.play(1,0);
        game.play(1,1);
        game.play(2,1);
        game.play(2,2);
    }
}

let obj = new Start();
obj.play();

