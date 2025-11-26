const { v4: uuidv4 } = require('uuid');
const { generateMinesHash, randomNumber, factorial } = require('../../helper/mainHelper');
const { RoundResult } = require('../constant');

const MinMinesCount = 2;
const BoardRows = 5;
const BoardCols = 5;

module.exports = class MinesRound {
    roundNumber;
    roundResult;
    roundDate;
    minesCount;
    diamondCount;
    userId;
    betAmount;
    serverSeed;
    clientSeed;
    resultBoard;
    selectBoard;
    currentPayout;
    nextPayout;
    cellPicked;
    isFinished;

    constructor(data) {
        this.initMinesData(data);
    }

    initMinesData(data) {
        this.roundNumber = uuidv4();
        this.roundResult = RoundResult.none;
        this.roundDate = new Date();
        this.minesCount = data.minesCount;
        this.diamondCount = 0;
        this.userId = data.userId;
        this.betAmount = data.betAmount;
        this.coinType = data.coinType;
        this.serverSeed = data.serverSeed;
        this.clientSeed = data.clientSeed;
        this.cellPicked = false;
        this.isFinished = false;
        this.currentPayout = 1;
        this.nextPayout = this.generateNextMultiplier(this.minesCount, this.diamondCount + 1);
        this.resultBoard = this.generateResultBoard();
        this.selectBoard = Array.from(Array(BoardRows), () => Array(BoardCols).fill(false));
    }

    generateResultBoard() {
        let board = Array.from(Array(BoardRows), () => Array(BoardCols).fill(false));

        let randomIndices = [];
        while (randomIndices.length < this.minesCount) {
            const randomIndex = randomNumber(BoardCols * BoardRows);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }
        for (const index of randomIndices) {
            const row = Math.floor(index / BoardRows);
            const col = index % BoardCols;
            board[row][col] = true;
        }
        return board;
    }

    generatePayout(minesCount) {
        return PayoutList[minesCount - MinMinesCount];
    }

    payoutRound() {
        if (!this.isFinished) {
            this.roundResult = RoundResult.payout;
            this.isFinished = true;
        }
    }

    finishRound() {
        if (!this.isFinished) {
            this.roundResult = RoundResult.finish;
            this.isFinished = true;
        }
    }

    lostRound() {
        if (!this.isFinished) {
            this.roundResult = RoundResult.lost;
            this.isFinished = true;
        }
    }

    getFinished() {
        return this.isFinished;
    }

    getCellPicked() {
        return this.cellPicked;
    }

    isOwner(userId) {
        return this.userId === userId;
    }

    pickCell(i, j) {
        this.cellPicked = true;
        this.selectBoard[i][j] = true;
        let cellInfo = this.resultBoard[i][j];
        if (!cellInfo) {
            this.diamondCount = this.diamondCount + 1;
            this.currentPayout = this.nextPayout;
            this.nextPayout = this.generateNextMultiplier(this.minesCount, this.diamondCount + 1);
        }
        return { status: true, info: cellInfo };
    }

    generateNextMultiplier(mines, diamond) {
        if ((mines + diamond) > (BoardCols * BoardRows))
            return 0;

        let houseEdge = 0.01;
        return Number(Number((1 - houseEdge) * this.nCr(25, diamond) / this.nCr(25 - mines, diamond)).toFixed(2));
    }

    nCr(n, r) {
        return factorial(n) / factorial(r) / factorial(n - r);
    }
}