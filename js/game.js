'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '♆';
const ALIEN = '👽';
const LASER = '⤊';
const GROUND = 'GROUND';
const FLOOR = 'FLOOR';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const CANDY = '🍭';
const NumOfSuperAttacks = 3;

var gBoard;
var gGame = false;
var gScore;
var gAvailableAliens;
var gShoot = LASER;
var isSuperAttacks = true;
var gAliensRowLength = ALIENS_ROW_LENGTH;
var gAliensRowCount = ALIENS_ROW_COUNT;
var gSuperAttacks = NumOfSuperAttacks;
var gCandyInterval;
var gIsAppear;
var gShouldClearNeighbors = false;
var gAliensSpeed = 1000;
var gIsDifficultLevelChosen = false;


function initGame(elBtn) {
    initParameters();
    createHero(gBoard);
    createAliens(gBoard);
    setVisibleElements();
    renderBoard(gBoard);

    if (elBtn) {
        gGame = true;
        moveAliens(gBoard, LEFT);
        gCandyInterval = setInterval(addSpaceCandies, 10000, gBoard)
    }
}


function initParameters() {
    clearAllMainIntervals();
    gSuperAttacks = NumOfSuperAttacks;
    gHero.pos = { i: 12, j: 5 }
    gScore = 0;
    gAvailableAliens = 0;
    gBoard = createBoard();
    gAliensTopRowIdx = gInitAliensTopRowIdx;
}

function clearAllMainIntervals() {
    clearInterval(gIntervalAliens);
    clearInterval(gCandyInterval);
}


function setVisibleElements() {
    if (!gIsDifficultLevelChosen) {
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.difficult-levels').style.display = 'flex';
    } else {
        document.querySelector('.start').style.display = 'grid';
    }
    document.querySelector('.restart').style.display = 'none';
    document.querySelector('.victory-or-game-over').style.display = 'none';
    document.querySelector('.super-attacks span').innerText = gSuperAttacks;
    document.querySelector('.score span').innerText = gScore;
    document.querySelector('.aliens-num span').innerText = gAvailableAliens;
    document.querySelector('.score span').innerText = gScore;
}


function createBoard() {
    var board = createMat(BOARD_SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameObject: null };

            if (i === board.length - 1) {
                cell.type = GROUND;
            }

            board[i][j] = cell;
        }
    }

    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j });

            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === GROUND) cellClass += ' ground';


            strHTML += '\t<td class="cell ' + cellClass +
                '"  onclick="moveTo(' + i + ',' + j + ')" >\n';


            if (currCell.gameObject === HERO) {
                strHTML += HERO;
            } else if (currCell.gameObject === ALIEN) {
                strHTML += ALIEN;
            } else if (currCell.gameObject === CANDY) {
                strHTML += CANDY;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';

    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function updateCell(pos, gameObject = null) {
    var rowColumns = gBoard[pos.i];
    var column = rowColumns ? rowColumns[pos.j] : null;

    if (column) {
        var targetCell = rowColumns[pos.j];

        if (targetCell.gameObject === ALIEN) {
            gAvailableAliens--;
            document.querySelector('.aliens-num span').innerText = gAvailableAliens;
        }

        targetCell.gameObject = gameObject;
        var className = getClassName(pos);
        var elCell = getElCell(className);
        elCell.innerHTML = gameObject || '';
    }
}


function addSpaceCandies(board) {

    for (var j = 0; j < board[0].length; j++) {
        var targetCell = board[0][j];

        if (targetCell.gameObject !== ALIEN) {
            updateCell({ i: 0, j }, CANDY);
        }
    }

    setTimeout(() => {
        removeCandies(board);
    }, 5000);
}


function removeCandies(board) {
    for (var j = 0; j < board[0].length; j++) {

        if (board[0][j].gameObject === CANDY) {
            updateCell({ i: 0, j });
        }
    }
}


function updateScore(newScore) {
    gScore = newScore;
    var elScoreCounter = document.querySelector('h2 span');
    elScoreCounter.innerText = gScore;
}


function handleKey(event) {

    var i = gHero.pos.i;
    var j = gHero.pos.j;

    if (gGame) {
        switch (event.key) {

            case 'ArrowLeft':
                moveTo(i, j - 1);
                break;

            case 'ArrowRight':
                moveTo(i, j + 1);
                break;

            case ' ':
                if (!gHero.isShoot) {
                    shoot();
                }
                break;

            case 'x':
                if (isSuperAttacks) {
                    gShoot = '^'
                    gLazerSpeed = 70;
                    gSuperAttacks--;
                    document.querySelector('.super-attacks span').innerText = gSuperAttacks;
                }

                if (gSuperAttacks === 0) isSuperAttacks = false;
                break;
            case 'n':
                gShouldClearNeighbors = true;
                break;
        }

    }
}


function setDifficultLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Easy':
            gAliensSpeed = 1800;
            gAliensRowLength = 7;
            gAliensRowCount = 3;
            break;
        case 'Normal':
            gAliensSpeed = 1200;
            gAliensRowLength = 8;
            gAliensRowCount = 4;
            break;
        case 'Hard':
            gAliensSpeed = 600;
            gAliensRowLength = 9;
            gAliensRowCount = 5;
            break;
        default:
            break;
    }

    gIsDifficultLevelChosen = true;

    document.querySelector('.start').style.display = 'grid';
    document.querySelector('.difficult-levels').style.display = 'none';
}


function restart() {
    document.querySelector('.difficult-levels').style.display = 'flex';
    document.querySelector('.restart').style.display = 'none';
    gScore = 0;
    document.querySelector('.score span').innerText = gScore;
}
