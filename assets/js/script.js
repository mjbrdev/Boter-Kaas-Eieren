const settingsBtn = document.querySelector('.menu');
const settingsBtn2 = document.querySelector('.dropdown');

settingsBtn.addEventListener('click', function handleClick(event) {
	settingsBtn.classList.toggle('active');
	settingsBtn2.classList.toggle('active');
});

const PLAYER_X_CLASS = 'x'
const PLAYER_O_CLASS = 'circle'
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const cellElements = document.querySelectorAll('[data-cell]')
const boardElement = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.getElementById('winningMessageText')
const iframeElement = document.getElementById('winningMessageText')
let isPlayer_O_Turn = false
let confettiTimeout

const CONFETTI_COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff']

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
	clearConfetti()
	isPlayer_O_Turn = false
	cellElements.forEach(cell => {
		cell.classList.remove(PLAYER_X_CLASS)
		cell.classList.remove(PLAYER_O_CLASS)
		cell.removeEventListener('click', handleCellClick)
		cell.addEventListener('click', handleCellClick, { once: true })
	})
	setBoardHoverClass()
	winningMessageElement.classList.remove('show')
	iframeElement.classList.remove('show')
	boardElement.classList.remove('not-visible')
}

function handleCellClick(e) {
	const cell = e.target
	const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS
	placeMark(cell, currentClass)
	if (checkWin(currentClass)) {
		endGame(false)
	} else if (isDraw()) {
		endGame(true)
	} else {
		swapTurns()
		setBoardHoverClass()
	}
}

function endGame(draw)	{
	if (draw)	{
		winningMessageElement.innerHTML = "Het is gelijk spel! "
	} else {
		winningMessageElement.innerHTML = `Speler ${isPlayer_O_Turn ? "O" : "X"} Heeft Gewonnen!`
		launchConfetti()
	}
	winningMessageElement.classList.add('show')
	boardElement.classList.add('not-visible')
}

function launchConfetti() {
	const confettiElement = document.createElement('div')
	confettiElement.className = 'confetti-burst'
	confettiElement.setAttribute('aria-hidden', 'true')

	for (let index = 0; index < 64; index++) {
		const piece = document.createElement('span')
		const launchedFromLeft = index % 2 === 0
		const horizontalDistance = 10 + Math.random() * 45
		const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]

		piece.className = 'confetti-piece'
		piece.style.setProperty('--origin-x', launchedFromLeft ? '0%' : '100%')
		piece.style.setProperty('--travel-x', `${launchedFromLeft ? horizontalDistance : -horizontalDistance}vw`)
		piece.style.setProperty('--travel-y', `${-40 - Math.random() * 50}vh`)
		piece.style.setProperty('--spin', `${Math.random() * 1080 - 540}deg`)
		piece.style.setProperty('--delay', `${Math.random() * 180}ms`)
		piece.style.setProperty('--piece-width', `${4 + Math.random() * 6}px`)
		piece.style.setProperty('--piece-height', `${8 + Math.random() * 8}px`)
		piece.style.backgroundColor = color
		confettiElement.append(piece)
	}

	document.body.append(confettiElement)
	confettiTimeout = window.setTimeout(() => {
		confettiElement.remove()
		confettiTimeout = undefined
	}, 3200)
}

function clearConfetti() {
	document.querySelector('.confetti-burst')?.remove()
	window.clearTimeout(confettiTimeout)
	confettiTimeout = undefined
}

function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS)
	})
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass)
}

function swapTurns() {
	isPlayer_O_Turn = !isPlayer_O_Turn
}

function setBoardHoverClass() {
	boardElement.classList.remove(PLAYER_X_CLASS)
	boardElement.classList.remove(PLAYER_O_CLASS)
	if (isPlayer_O_Turn) {
		boardElement.classList.add(PLAYER_O_CLASS)
	} else {
		boardElement.classList.add(PLAYER_X_CLASS)
	}
}

function checkWin(currentClass) {
	return WINNING_COMBINATIONS.some(combination => {
		return combination.every(index => {
			return cellElements[index].classList.contains(currentClass)
		})
	})
}