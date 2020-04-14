const rollDice = e => {
    let num = 1//Math.ceil(Math.random() * 12);
    document.querySelector('#dice').textContent = sorryCardCalc(num)
    document.querySelector('#details').textContent = specialCardCalc(num-1)
    // e.target.disabled = true
    diceRoll = num
    playerGo()
}

const clearRoll = () => {
    document.querySelector('#dice').textContent = ''
    document.querySelector('#details').textContent = ''
}


const sorryCardCalc = num => {
    return (num == 9) ? 'Sorry!' : num;
}

const specialCardCalc = num => {
    const cards = [
        'Start a new piece or move a piece 1 space forward',
        'Start a new piece or move a piece 2 spaces forwards',
        'Move a piece 3 spaces forwards',
        'Move a piece 4 spaces backwards',
        'Move a piece 5 spaces forwards',
        'Move a piece 6 spaces forwards',
        'Move one piece 7 spaces forward or split the 7 spaces between two pieces',
        'Move a piece 8 spaces forwards',
        "Take any one piece from Start and move it directly to a square occupied by any opponent's piece, sending" +
        " that piece back to the Start",
        'Move a piece 10 spaces forwards or 1 space backwards',
        "Move a piece 11 spaces forward, or switch places of one of the player's own pieces and an opponent's" +
        ' pieces',
        'Move a piece 12 spaces forwards',
    ];
    return cards[num];
}

const getDiceValue = () => {
    const values = [
        1,2,3,-4,5,6,7,8,9,10,11,12
    ]
    return values[diceRoll-1];
}

document.querySelector('.roll').addEventListener('click', rollDice)
document.querySelector('body').addEventListener('keypress', e => {
    if (e.which == 114) { // pressed key 'r'
        rollDice(e)
    }
})