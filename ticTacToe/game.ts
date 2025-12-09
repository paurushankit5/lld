import { Board } from "./board";
import { Player } from "./player";
import Queue from 'queue-fifo';

export class Game{

    board :Board;
    players : Player[];
    playersQueue: Queue<Player>;
    winner : Player|null;

    constructor(board :Board){
        this.board = board;
        this.players = [];
        this.winner = null;
        this.playersQueue = new Queue<Player>;
    }

    addPlayer(player :Player){
        this.players.push(player);
        this.playersQueue.enqueue(player);
    }

    getBoard(){
        return this.board;
    }

    getWinner(){
        return this.winner;
    }

    play(row :number,  col :number){
        if(this.winner){
            console.log('Game is already won');
            return;
        }else if (!this.board.isBoardEmpty()){
            console.log('Board has no place to play. Game Drawn');
            return;
        }

        let player = this.getNextPlayer();
        if(player) this.board.addPiece(player.getPiece(), row, col);
        if(this.board.hasWon(player?.getPiece().getSymbol(), row, col) ){
            this.winner = player;
            console.log('Game eneded');
        }else{
            console.log("Game is still on");
        }

    }

    getNextPlayer(){
        if(!this.playersQueue.isEmpty()){
            let player = this.playersQueue.dequeue();//remove from first
            this.playersQueue.enqueue(player);// put in last
            return player;

        } 
        return null;
    }






}