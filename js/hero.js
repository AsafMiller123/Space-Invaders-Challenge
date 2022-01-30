'use strict'

const LASER_SPEED = 300;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false, currCellContent: null };
var gLazerSpeed = LASER_SPEED
var gNextShootPos = { ...gHero.pos }


function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
}


function shoot() {
    gHero.isShoot = true;
    gNextShootPos = { ...gHero.pos };
    gNextShootPos.i--;
    var interval = setInterval(() => {
        blinkLaser(gNextShootPos);
        var targetCell = gBoard[gNextShootPos.i][gNextShootPos.j];

        if (targetCell.gameObject === ALIEN) {
            updateScore(gScore + 10);
            if (gShouldClearNeighbors) {
                clearNeighbors(gNextShootPos);
                gShouldClearNeighbors = false;
            }

        } else if (targetCell.gameObject === CANDY) {
            updateScore(gScore + 50);
        }

        if (targetCell.gameObject === ALIEN || gNextShootPos.i === 0) {
            clearInterval(interval);
            updateCell(gNextShootPos);
            gHero.isShoot = false;
            gShoot = LASER;
            gLazerSpeed = LASER_SPEED;
        }

        if (gAvailableAliens === 0) {
            clearInterval(interval);
            setVictoryOrGameOver('Victory!');
            return;
        }
    }, gLazerSpeed);
}


function blinkLaser(pos) {

    var blinkLaser = {
        location: {
            i: pos.i--,
            j: pos.j
        }
    }

    updateCell(blinkLaser.location, gShoot);
    setTimeout(() => {
        updateCell(blinkLaser.location);
        gBoard[blinkLaser.location.i][blinkLaser.location.j].gameObject = null;
    }, gLazerSpeed);
}


function moveTo(i, j) {

    var targetCell = gBoard[i][j];

    if (targetCell === gBoard[12][14]) return

    var iAbsDiff = Math.abs(i - gHero.pos.i);
    var jAbsDiff = Math.abs(j - gHero.pos.j);

    if (jAbsDiff === 1 && iAbsDiff === 0) {
        gBoard[gHero.pos.i][gHero.pos.j].gameObject = null;
        updateCell(gHero.pos, '');

        gHero.pos.i = i;
        gHero.pos.j = j;

        updateCell(gHero.pos, HERO)
    }
}


function clearNeighbors(laserPosition) {
    const i = laserPosition.i;
    const j = laserPosition.j;

    updateCell({ i: i + 1, j });
    updateCell({ i: i - 1, j });
    updateCell({ i, j: j + 1 });
    updateCell({ i, j: j - 1 });
    updateCell({ i: i + 1, j: j + 1 });
    updateCell({ i: i + 1, j: j - 1 });
    updateCell({ i: i - 1, j: j + 1 });
    updateCell({ i: i - 1, j: j - 1 });
}


function setVictoryOrGameOver(label) {
    clearInterval(gCandyInterval);
    removeCandies(gBoard);
    document.querySelector('.victory-or-game-over').style.display = 'block'
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.restart').style.display = 'grid';
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.victory-or-game-over').innerText = label;

}
