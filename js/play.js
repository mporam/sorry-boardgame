const canGo = () => {
    const piecesInStart = getPiecesInStart().length
    const piecesFinished = document.querySelectorAll('.piece.p' + playerTurn + '.finished').length

    if (piecesInStart == 0 && diceRoll == 9) { // if none in start and rolled sorry, cannot go
        return false
    }

    if (diceRoll == 9 && piecesInStart > 0) { // if some in start and rolled sorry
        let opponentsPieces = document.querySelectorAll('.item.cell .piece:not(.p' + playerTurn + ')')

        opponentsPieces = [...opponentsPieces].filter(piece => {
            if (piece.parentElement.dataset.finish && parseInt(piece.parentElement.dataset.finish) > 1) {
                return false
            }
            return true
        })

        // return if other players have pieces in play
        return (opponentsPieces.length > 0)
    }

    if (piecesInStart < 4 && piecesFinished < 4) { // pieces in play
        return true
    }
    return (canStart());
}

const canStart = () => {
    return ((diceRoll < 3 || diceRoll == 9) && getPiecesInStart().length > 0);
}

const getPiecesInStart = () => {
    return document.querySelectorAll('.cell.p' + playerTurn + ' .piece')
}

const cellDoesntHaveOwnPiece = piece => {
    let pieceCell = piece.parentElement
    let cell = parseInt(pieceCell.dataset.cell)

    if (isNaN(cell) && pieceCell.classList.contains('item-2-2')) { // piece in start position
        cell = parseInt(pieceCell.dataset.next)
    }

    if (
        pieceCell.dataset.finish &&
        pieceCell.dataset.finish != 4 &&
        pieceCell.dataset.player == playerTurn
    ) {
        // piece in finish squares but not start/finish

        let targetCell

        if (diceRoll === 4) {
            cell = diceRoll - parseInt(pieceCell.dataset.finish)
            cell = ((parseInt(piece.dataset.end)) - cell)
            targetCell = selectCell(cell)
        } else {
            cell = parseInt(pieceCell.dataset.finish) + getDiceValue()
            targetCell = document.querySelector('[data-finish="' + cell + '"][data-player="' + playerTurn + '"]')
        }
        if (cell === 4) {
            return true;
        }
        if (targetCell) {
            return (targetCell.querySelectorAll('.piece.p' + playerTurn).length == 0)
        }
        return false
    }

    cell += getDiceValue()
    cell = selectCell(cell)
    if (cell != false) {
        return (cell.querySelectorAll('.piece.p' + playerTurn).length == 0)
    }
    return false
}

// @todo: dup logic with cellWithinRange
const isGoingPastEnd = (piece, cellId) => {
    if (diceRoll == 4) {
        return false
    }
    let currentCell = parseInt(piece.parentElement.dataset.cell)
    let pieceEnd = parseInt(piece.dataset.end)

    if (piece.dataset.player === "1" && (currentCell < 4 || currentCell > 27)) {
        return (cellId < 7 && cellId > 3)
    }

    if (piece.dataset.player === "4" && currentCell > 24 && currentCell < 31) {
        let moveAmount = (cellId - pieceEnd);
        return (moveAmount <= 4 && moveAmount != 0)
    }

    if (currentCell <= pieceEnd && cellId > pieceEnd) {
        let moveAmount = (cellId - pieceEnd);
        return (moveAmount <= 4 && moveAmount != 0)
    }

    return false
}

const cellWithinRange = piece => {
    if (diceRoll == 4) { // going backwards is always in range
        return true
    }
    let pieceCell = piece.parentElement
    let currentCell = parseInt(pieceCell.dataset.cell)

    if (isNaN(currentCell) && pieceCell.classList.contains('item-2-2')) {// if in the start position
        return true
    }

    if (pieceCell.dataset.finish && pieceCell.dataset.player == playerTurn) { // piece in finish squares
        currentCell = parseInt(pieceCell.dataset.finish) + getDiceValue()
        return (currentCell < 5)
    }

    let targetCell = currentCell + getDiceValue()
    let selectedCell = selectCell(targetCell)
    let targetCellId = parseInt(selectedCell.dataset.cell)
    let pieceEnd = parseInt(piece.dataset.end)

    // handle player 1 differently because is at the end of the track
    if (piece.dataset.player === "1") {
        if (currentCell < 4) {
            return (targetCellId < 7)
        }

        if (currentCell > 28) {
        return (targetCellId > currentCell || targetCellId < 7)
        }
    }

    // if player 4 has potential to go past end, return false if it does
    if (piece.dataset.player === "4" && currentCell > 24 && currentCell < 31) {
        return (targetCellId < 34 && targetCellId > 25)
    }

    if (currentCell <= pieceEnd && targetCellId > pieceEnd) {
        return ((targetCellId - pieceEnd) <= 4)
    }

    return true


        // player 1 calc?
        //(selectedPiece.dataset.player == 1) && (currentCellId < 4 || currentCellId > 28)

        // move cell to finish track
        // cell = document.querySelector('[data-player="' + selectedPiece.dataset.player + '"][data-finish="' + count + '"]')
}

const waitNextGo = () => {
    setTimeout(nextGo, 300)
}


const nextGo = () => {
    clearRoll()
    activePieces.forEach(piece => {
        piece.classList.remove('active', 'inactive')
        piece.removeEventListener('click', calculatePieceMove)
    })
    activePieces = []

    hidePlayerCantGoMessage()
}

const playerGo = () => {
    if (canGo()) {
        document.querySelector('.player-turn').classList.remove('error')
        activatePieces()
    } else {
        showPlayerCantGoMessage()
        waitNextGo()
    }
}

const showPlayerCantGoMessage = () => {
    document.querySelector('.player-turn').classList.add('error')
    document.querySelector('#playerAction').textContent = 'cannot go'
}

const hidePlayerCantGoMessage = () => {
    document.querySelector('.player-turn').classList.remove('error')
    document.querySelector('#playerAction').textContent = 'turn'
    if (playerTurn == playerCount) {
        playerTurn = 1
    } else {
        playerTurn++;
    }
    document.querySelector('#playerNo').textContent = playerTurn
}

const activatePieces = () => {
    activePieces = document.querySelectorAll('.piece.p' + playerTurn)
    let inactive = []
    activePieces.forEach(piece => {
        if (canPieceMove(piece)) {
            piece.classList.add('active')
            piece.addEventListener('click', calculatePieceMove)
        } else {
            inactive.push(piece)
            piece.classList.add('inactive')
        }
    })
    if (inactive.length == 4) {
    // if (inactive.length == document.querySelectorAll('.piece.p' + playerTurn).length) { // REMOVE
        showPlayerCantGoMessage()
        waitNextGo()
    }
}

const calculatePieceMove = (e) => {
    let targetCell
    selectedPiece = e.target
    resetPieceMove()
    selectedPiece.classList.add('selected')
    let targetCellId

    if (diceRoll == 9) {
        let targetCells = document.querySelectorAll('.item.cell .piece:not(.p' + playerTurn + ')')
        targetCells = [...targetCells].filter(piece => {
            if (piece.parentElement.dataset.finish && parseInt(piece.parentElement.dataset.finish) > 1) {
                return false
            }
            return true
        })

        targetCells.forEach((piece) => {
            let cell = piece.parentElement
            cell.classList.add('moveTo')
            cell.addEventListener('click', movePiece)
        })
        return
    }

    if (selectedPiece.parentElement.classList.contains('item-2-2')) {
        // minus 1 because start cell counts as 1
        targetCellId = parseInt(document.querySelector('.p' + playerTurn + '-start').dataset.cell) + (diceRoll - 1)
        targetCell = selectCell(targetCellId)
    } else if (selectedPiece.parentElement.dataset.finish && selectedPiece.parentElement.dataset.player == playerTurn) {
        if (diceRoll == 4) {
            targetCellId = diceRoll - parseInt(selectedPiece.parentElement.dataset.finish)
            targetCellId = ((parseInt(selectedPiece.dataset.end)) - targetCellId)
            targetCell = selectCell(targetCellId)
        } else {
            targetCellId = parseInt(selectedPiece.parentElement.dataset.finish) + getDiceValue()
            targetCell = document.querySelector('[data-finish="' + targetCellId + '"][data-player="' + playerTurn + '"]')
        }
    } else {
        targetCellId = parseInt(selectedPiece.parentElement.dataset.cell) + getDiceValue()
        targetCell = selectCell(targetCellId)
    }

    if (targetCell == undefined || targetCell == null) {
        debugger // how did you get here?
        waitNextGo() // cant figure it out, just keep going, shhh
    }

    targetCell.classList.add('moveTo')
    targetCell.addEventListener('click', movePiece)
}

const movePiece = (e) => {
    let cell
    // detect if user clicked on piece or cell
    if (e.target.classList.contains('piece')) {
        cell = e.target.parentElement
    } else {
        cell = e.target
    }

    if (cell.classList.contains('item-2-2')) {
        selectedPiece.classList.add('finished')

        if (allFinished(selectedPiece.dataset.player)) {
            displayWinner(selectedPiece.dataset.player)
        }
    } else if (cell.querySelectorAll('.piece').length > 0 ) {
        let playerPiece = cell.querySelector('.piece')
        let playerId = playerPiece.dataset.player
        document.querySelector('.item-2-2.p' + playerId).appendChild(playerPiece)
        showModal('sorry');

        setTimeout(() => {
            hideModal('sorry')
        }, 3000)
    }

    cell.appendChild(selectedPiece)

    document.querySelectorAll('.moveTo').forEach(cell => {
        cell.classList.remove('moveTo')
        cell.removeEventListener('click', movePiece)
    })

    selectedPiece.classList.remove('selected')
    selectedPiece = undefined
    nextGo()
}

const selectCell = id => {
    const cellCount = document.querySelectorAll('.item.cell[data-cell]').length
    if (id > cellCount) { // going past the end
        id = (id - cellCount)
    } else if (id < 1) { // going backwards past the end
        id = (cellCount + id)
    }

    let cell = document.querySelector('[data-cell="' + id + '"]')

    if (selectedPiece != undefined) {
        // debugger
        if (isGoingPastEnd(selectedPiece, id)) {
            let finishId = (id - parseInt(selectedPiece.dataset.end))
            cell = document.querySelector(
                '[data-player="' + selectedPiece.dataset.player + '"][data-finish="' + finishId + '"]'
            )
        }
    }

    if (cell != null) {
        return cell
    }
    return false
}

const canPieceMove = piece => {
    if (piece.classList.contains('finished')) {
        return false
    }

    if (
        piece.parentElement.classList.contains('item-2-2') && // if in start
        diceRoll == 9 && // and rolled a sorry card
        document.querySelectorAll('.item.cell .piece:not(.p' + playerTurn + ')').length > 0 // and other players
        // have pieces in play
    ) {
        return true
    } else if (diceRoll == 9) {
        return false
    }

    const startMove = (
        (piece.parentElement.classList.contains('item-2-2') && (diceRoll < 3)) ||
        !piece.parentElement.classList.contains('item-2-2')
    )

    let x = cellDoesntHaveOwnPiece(piece)
    let y = cellWithinRange(piece)
    return (
        x &&
        y &&
        startMove
    )
}

const resetPieceMove = () => {
    let moveTo = document.querySelector('.cell.moveTo')
    if (moveTo != null) {
        moveTo.removeEventListener('click', movePiece)
        moveTo.classList.remove('moveTo')
    }
    activePieces.forEach(piece => {piece.classList.remove('selected')})
}

const allFinished = playerId => {
    return (document.querySelectorAll('.item-2-2.p' + playerId + ' .finished').length == 3)
}

const displayWinner = (playerId) => {
    document.querySelector('#winningPlayerId').textContent = playerId
    document.querySelector('#continue').addEventListener('click', e => {
        hideModal('winner')
    })
    showModal('winner')
}


