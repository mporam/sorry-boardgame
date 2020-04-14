showModal('startScreen');

let playerCount = 4
let playerTurn = 1
let diceRoll = 0
let activePieces = []
let selectedPiece

document.querySelector('#play').addEventListener('click', e => {
    hideModal('startScreen');
    playerCount = document.querySelector('#playerCount').value;
    hidePlayers()
    document.querySelector('.player-turn').classList.remove('hide')
})

const hidePlayers = () => {
    let player = parseInt(playerCount);
    while (player < 4) {
        player++;
        document.querySelectorAll('.piece.p' + player).forEach(piece => {
            piece.classList.add('hide')
        })
    }
}