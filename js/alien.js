'use strict'

const ALIEN_SPEED = 500;

var gIntervalAliens;
var gInitAliensTopRowIdx = 0;
var gAliensTopRowIdx = gInitAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;


function createAliens(board) {
    for (var i = gAliensTopRowIdx; i < gAliensRowCount + gAliensTopRowIdx; i++) {
        for (var j = BOARD_SIZE - 1; j > BOARD_SIZE - gAliensRowLength - 1; j--) {
            board[i][j].gameObject = ALIEN;
            gAvailableAliens++;
        }
    }
}


function shiftBoardRight(board, fromI, toI) {

    for (var z = toI.j; z >= fromI.j; z--) {
        var previousCell = board[fromI.i][z];
        var previousGameObject = previousCell.gameObject;
        var targetCell = board[toI.i][z + 1];
        previousGameObject && targetCell && (targetCell.gameObject = previousGameObject);
        previousCell.gameObject = null;
    }
}


function shiftBoardLeft(board, fromI, toI) {

    for (var z = toI.j; z <= fromI.j; z++) {
        var previousCell = board[fromI.i][z];
        var previousGameObject = previousCell.gameObject;
        var targetCell = board[toI.i][z - 1];
        previousGameObject && targetCell &&(targetCell.gameObject = previousGameObject);
        previousCell.gameObject = null;
    }
}


function shiftBoardDown(board, fromI, toI) {

    for (var z = toI.i; z >= fromI.i; z--) {
        for (var m = fromI.j; m <= toI.j; m++) {
            var previousCell = board[z - 1 > 0 ? z - 1 : 0][m];
            var previousGameObject = previousCell.gameObject;
            var targetCell = board[z][m];
            previousGameObject && targetCell && previousGameObject !== CANDY && (targetCell.gameObject = previousGameObject);
            previousCell.gameObject = null;
        }
    }
}


function moveAliens(board, moveSteps) {

    var shouldKeepMoving = {};
    var firstInterval = true;

    gIntervalAliens = setInterval(() => {
        
        for (var i = gAliensTopRowIdx; i < gAliensTopRowIdx + gAliensRowCount; i++) {
            if (firstInterval) {
                shouldKeepMoving[i] = true;
                if (i === gAliensTopRowIdx + gAliensRowCount - 1) { 
                    firstInterval = false;
                }
            };

            if (moveSteps === LEFT) {
                shiftBoardLeft(board, { i: i, j: BOARD_SIZE - 1 }, { i: i, j: 0 });
                if (board[i][0].gameObject === ALIEN) {
                    shouldKeepMoving[i] = false;
                }
            } else if (moveSteps === RIGHT) {
                shiftBoardRight(board, { i: i, j: 0 }, { i: i, j: BOARD_SIZE - 1 });
                if (board[i][BOARD_SIZE - 1].gameObject === ALIEN) {
                    shouldKeepMoving[i] = false;
                }
            }

            renderBoard(board);

            if (Object.keys(shouldKeepMoving).length > 0 && 
                (Object.values(shouldKeepMoving).includes(false) && i === gAliensTopRowIdx + gAliensRowCount - 1)) {
                clearInterval(gIntervalAliens);

                var direction = moveSteps === RIGHT ? LEFT : RIGHT;

                setTimeout(() => {
                    gAliensTopRowIdx++;
                    if (gAliensTopRowIdx + gAliensRowCount - 1 === gHero.pos.i) {
                        setVictoryOrGameOver('Game Over!');
                        return;
                    };
                    shiftBoardDown(board, { i: gAliensTopRowIdx, j: 0 }, { i: gAliensTopRowIdx + gAliensRowCount - 1, j: BOARD_SIZE - 1 });
                    renderBoard(board);
                    moveAliens(gBoard, direction);
                }, gAliensSpeed - 200);
            }
        }

    }, gAliensSpeed);
}
