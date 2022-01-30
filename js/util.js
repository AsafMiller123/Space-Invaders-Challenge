'use strict'

function createMat(BOARD_SIZE) {
    var mat = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        var row = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getElCell(class1) {
    return document.querySelector(`.${class1}`);
}
