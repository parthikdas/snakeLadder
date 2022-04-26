let noOfPlayers = 0, turn = 0
let playerPos = [] // array to store the position of players, depending on the number of players every index will have -1 and then eventually it will go
let ladderPos = {
    7: 26,
    13: 55,
    21: 78,
    36: 64,
    47: 68,
    50: 92,
    67: 86
}, snakePos = {
    99: 9,
    93: 51,
    90: 11,
    87: 37,
    77: 17,
    60: 19,
    52: 27,
    46: 6
}

document.addEventListener('DOMContentLoaded', () => {
    // decorate the grid when page is loaded
    for(let i = 1; i <= 100; i++) {
        document.getElementById(i).style = `background-color: ${i&1 ? '#2d3a4a' : '#c6a178'}; color: ${i&1 ? '#c6a178' : '#2d3a4a'};`
    }
    // putting the stairs
    let ladderArr = Object.keys(ladderPos), gap = document.getElementById(1).offsetHeight/2
    for(let i = 0; i < ladderArr.length; i++) {
        let l1 = document.getElementById('l' + i + '1'), l2 = document.getElementById('l' + i + '2')
        l1.setAttribute('x1',document.getElementById(ladderPos[ladderArr[i]]).getBoundingClientRect().left + gap)
        l1.setAttribute('y1',document.getElementById(ladderPos[ladderArr[i]]).getBoundingClientRect().top + gap)
        l1.setAttribute('x2',document.getElementById(ladderArr[i]).getBoundingClientRect().left + gap)
        l1.setAttribute('y2',document.getElementById(ladderArr[i]).getBoundingClientRect().top + gap)
        l2.setAttribute('x1',document.getElementById(ladderPos[ladderArr[i]]).getBoundingClientRect().left + gap*2)
        l2.setAttribute('y1',document.getElementById(ladderPos[ladderArr[i]]).getBoundingClientRect().top + gap)
        l2.setAttribute('x2',document.getElementById(ladderArr[i]).getBoundingClientRect().left + gap*2)
        l2.setAttribute('y2',document.getElementById(ladderArr[i]).getBoundingClientRect().top + gap)
    }
    // putting the snakes
    let snakeArr = Object.keys(snakePos)
    for(let i = 0; i < snakeArr.length; i++) {
        let s1 = document.getElementById('s' + i)
        s1.setAttribute('x1',document.getElementById(snakePos[snakeArr[i]]).getBoundingClientRect().left + gap)
        s1.setAttribute('y1',document.getElementById(snakePos[snakeArr[i]]).getBoundingClientRect().top + gap)
        s1.setAttribute('x2',document.getElementById(snakeArr[i]).getBoundingClientRect().left + gap)
        s1.setAttribute('y2',document.getElementById(snakeArr[i]).getBoundingClientRect().top + gap)
    }
})

// Function to get no of players
document.getElementById('noOfPlayersBut').addEventListener('click', () => {
    noOfPlayers = document.getElementById('noOfPlayers').value
    document.getElementById('playerBox').style.display = 'none'
    // show the players in playerInfo
    for(let i=1; i<=noOfPlayers; i++) {
        let li = document.createElement('li')
        li.style = 'width: 100%; display: flex; align-items: center; justify-content: space-between;'
        let p = document.createElement('p')
        p.innerHTML = 'Player ' + i
        li.append(p)
        let li1 = document.createElement('li')
        let color = 'red'
        if(i === 2) color = 'yellow'
        else if(i === 3) color = 'green'
        else if(i === 4) color = 'blue'
        li1.style = `height:1.4rem; width:1.4rem; background: ${color}; border-radius: 100%;`
        li.append(li1)
        document.getElementById('playerInfo').append(li)
    }
    // make the players ready
    for(let i = 1; i <= noOfPlayers; i++) {
        playerPos.push(0)
        let div = document.createElement('div')
        div.className = 'player'
        div.id = 'player' + i
        let color = 'red'
        if(i === 2) color = 'yellow'
        else if(i === 3) color = 'green'
        else if(i === 4) color = 'blue'
        let size = document.getElementById(1).offsetHeight/1.5 + 'px'
        div.style = `height: ${size}; width: ${size}; border-radius: 100%; background: ${color};`
        document.getElementById(1).append(div)
    }
})

// Function for roll
document.getElementById('roll').addEventListener('click', () => {
    // setInterval(()=>{ // remove later, its just to automate stuff
        let n = Math.ceil(Math.random() * 6)
        document.getElementById('dice').innerHTML = n
        if(n === 1) {
            if(playerPos[turn] === 0) playerPos[turn] = 1; // now game will start as the player is unlocked
            else {
                // move the player
                movePlayer(1)
                // increment
                if(playerPos[turn] + 1 <= 100) playerPos[turn] ++ // if move exceeds 100 don't do
                // ladder
                checkLadder()
                // snake
                checkSnake()
                // game over condition
                gameOver()
            }
        } else {
            if(playerPos[turn] > 0 && playerPos[turn] + n <= 100) { // if player is unlocked and move not exceeds 100
                // move the player
                movePlayer(n)
                // increment
                if(playerPos[turn] + turn <= 100) playerPos[turn] += n
                // ladder
                // setTimeout(
                // checkLadder(turn > 0 ? turn-1 : noOfPlayers-1),500) // as next turn was coming so sending prev turn
                checkLadder()
                // snake
                // setTimeout(
                // checkSnake(turn > 0 ? turn-1 : noOfPlayers-1),500)
                checkSnake()
                // game over condition
                gameOver()
            }
            turn = (++turn) % noOfPlayers // increment players
            document.getElementById('turn').innerHTML = 'Player ' + (turn+1) + ' turn'
        }   
    //},1000)
})

// Confirm from user if they really want to reset game
document.getElementById('reset').addEventListener('click', () => {
    if(confirm("Do you want to reset the game ?")) location.reload()
})

// Function to check for moving player
function movePlayer(diceVal) {
    document.getElementById('roll').disabled = true
    let playerName = 'player' + (turn+1), gap = document.getElementById(1).offsetHeight/5
    // matching the desired cell coordinates
    document.getElementById(playerName).style.left = document.getElementById(playerPos[turn] + diceVal).getBoundingClientRect().left+ (gap - turn*2) + 'px' // -turn because to make difference between 2 players if they are in same position
    document.getElementById(playerName).style.top = document.getElementById(playerPos[turn] + diceVal).getBoundingClientRect().top + gap + 'px'
    // player takes 1 sec to move so wait for 1 sec
    setTimeout(() => {
        document.getElementById('roll').disabled = false;
    },1000)
}

// Function to check for ladder
function checkLadder() {
    let newPos = ladderPos[playerPos[turn]]
    if(newPos != undefined) {
        movePlayer(newPos-playerPos[turn]) // sending the diff b/w old and new pos
        playerPos[turn] = newPos
    }
}

// Function to check for snake
function checkSnake() {
    let newPos = snakePos[playerPos[turn]]
    if(newPos != undefined) {
        movePlayer(newPos-playerPos[turn]) // sending the diff b/w old and new pos, here it will be -ve so it will go down
        playerPos[turn] = newPos
    }
}

// Function to check the game is over
function gameOver() {
    if(playerPos[turn] === 100){
        alert('Game over. Winner is Player ' + (turn+1))
        setTimeout(() => {
            location.reload()
        }, 1000)
    }
}