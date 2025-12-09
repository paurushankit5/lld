import { Piece } from "./piece";

export class Board{

    board : [];
    rowLen : number;
    colLen : number;
    totalAvailableMoves :number;
    winningStreak :number;


    constructor(rows :number, cols :number, winningStreak : number){
        this.board = [];
        this.rowLen = rows;
        this.colLen = cols;
        this.winningStreak = winningStreak;
        this.setupBoard();
        this.totalAvailableMoves = this.rowLen*this.colLen;
    }

    setupBoard(){
        for(let i =0; i< this.rowLen; i++){
            let tempCols :string[] = [];
            for(let j=0; j< this.colLen; j++){
                tempCols.push(".");
            }
            this.board.push(tempCols);
        }
    }

    displayBoard(){
        let rowLen = this.rowLen;
        let colLen = this.colLen;

        for(let i =0; i< rowLen; i++){
            let str = ""
            for(let j=0; j< colLen; j++){
                str += ` ${this.board[i][j]} `;
            }
            console.log(str);
        }
        console.log("\n")
        console.log("\n")
    }

    addPiece(piece :Piece, row: number, col :number){
        if(row >= this.rowLen || col >= this.colLen){
            console.log('Invalid Position');
            return;
        }

        if(this.board[row][col] != '.'){
            console.log('Position is alrready occupied');
            return;
        }

        this.board[row][col] = piece.getSymbol();
        this.totalAvailableMoves--;
        this.displayBoard();
    }

    isBoardEmpty(){
        return this.totalAvailableMoves > 0;
    }

    hasWon(symbol :string, row: number, col: number){
       let board = this.board;
        //vertical check
        {
            let tempRow = row-1;
            let tempCol = col;
            let count = 1;
            while(tempRow>=0 && board[tempRow][tempCol] == symbol){
                count++;
                tempRow--;
            }

            tempRow = row+1;
            while(tempRow<this.rowLen && board[tempRow][tempCol] == symbol){
                count++;
                tempRow++;
            }

            if(count >= this.winningStreak) return true;
        }

        //horizontal check
        {
            let tempRow = row;
            let tempCol = col-1;
            let count = 1;
            while(tempCol>=0 && board[tempRow][tempCol] == symbol){
                count++;
                tempCol--;
            }

            tempCol = col+1;
            while(tempCol<this.colLen && board[tempRow][tempCol] == symbol){
                count++;
                tempCol++;
            }

            if(count >= this.winningStreak) return true;
        }

        //left diagonal check
        {
            let tempRow = row-1;
            let tempCol = col-1;
            let count = 1;
            while(tempCol>=0 && tempRow >=0 && board[tempRow][tempCol] == symbol){
                count++;
                tempCol--;
                tempRow--;
            }

            tempCol = col+1;
            tempRow = row+1;
            while(tempRow<this.rowLen && tempCol < this.colLen  && board[tempRow][tempCol] == symbol){
                count++;
                tempCol++;
                tempRow++;
            }
            console.log(count);
            if(count >= this.winningStreak) return true;
        }

        //right diagonal check
        {
            let tempRow = row-1;
            let tempCol = col+1;
            let count = 1;
            while(tempCol<this.colLen && tempRow >=0 && board[tempRow][tempCol] == symbol){
                count++;
                tempCol++;
                tempRow--;
            }

            tempCol = col-1;
            tempRow = row+1;
            while(tempRow<this.rowLen && tempCol >=0  && board[tempRow][tempCol] == symbol){
                count++;
                tempCol--;
                tempRow++;
            }

            if(count >= this.winningStreak) return true;
        }

        return false;
    }





}