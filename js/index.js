window.onload = function () {
	const canvas = document.querySelector('.game__app');
	const ctx = canvas.getContext('2d');

	const gameContainer = document.querySelector('.game__container');

	const birdImage = new Image();

	birdImage.src = '../images/bird.png';

	const FLAP_SPEED = -4
	const BIRD_WIDTH = 40
	const BIRD_HEIGHT = 30
	const PIPE_WIDTH = 50
	const PIPE_GAP = 125

// Bird Vars
	let birdX = 50
	let birdY = 50
	let birdVelocity = 0
	let birdAcceleration = 0.1

// Pipe Vars
	let pipeX = 400
	let pipeY = canvas.height - 200

	let gameScore = document.querySelector('.game__score')
	let score = 0
	let highScore = 0

	let scored = false

	document.body.addEventListener('keyup', function (e) {
		if (e.code === 'Space') {
			birdVelocity = FLAP_SPEED
		}
	})

	document.querySelector('.game__restart').addEventListener('click', function () {
		hideEndMenu()
		resetGame()
		loop()
	})

	const increaseScore = () => {
		if (birdX > pipeX + PIPE_WIDTH &&
			(birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored) {
			score++
			gameScore.innerHTML = score
			scored = true
		}

		if (birdX < pipeX + PIPE_WIDTH) scored = false
	}

	const colissionCheck = () => {

//bound boxes for bird and pipes
		const birdBox = {
			x: birdX,
			y: birdY,
			width: BIRD_WIDTH,
			height: BIRD_HEIGHT
		}

		const topPipeBox = {
			x: pipeX,
			y: pipeY - PIPE_GAP + BIRD_HEIGHT,
			width: PIPE_WIDTH,
			height: pipeY
		}

		const bottomPipeBox = {
			x: pipeX,
			y: pipeY + PIPE_GAP + BIRD_HEIGHT,
			width: PIPE_WIDTH,
			height: canvas.height - pipeY - PIPE_GAP
		}

		// Collision with upper pipe
		if (birdBox.x + birdBox.width > topPipeBox.x &&
			birdBox.x < topPipeBox.x + topPipeBox.width &&
			birdBox.y < topPipeBox.y) {
			return true
		}

		// Collision with bottom pipe
		if (birdBox.x + birdBox.width > bottomPipeBox.x &&
			birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
			birdBox.y + birdBox.height > bottomPipeBox.y) {
			return true
		}

		//check if bird hits pipes
		if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
			return true
		}

		return false
	}

	const hideEndMenu = () => {
		document.querySelector('.game__result').style.display = 'none'
		gameContainer.classList.remove('blurry')
	}

	const showEndMenu = () => {
		document.querySelector('.game__result').style.display = 'block'
		gameContainer.classList.add('blurry')
		const endScore = document.querySelector('.game__end--score')
		endScore.innerHTML = score

		// Always update score after end game
		if (highScore < score) highScore = score

		document.querySelector('.game__best--score').innerHTML = highScore
	}

	const resetGame = () => {
		birdX = 50
		birdY = 50
		birdVelocity = 0
		birdAcceleration = 0.1

		pipeX = 400
		pipeY = canvas.height - 200

		score = 0
	}

	const endGame = () => {
		showEndMenu()
	}

	const loop = () => {
		//reset ctx after every loop
		ctx.clearRect(0, 0, canvas.width, canvas.height)


// draw bird
		ctx.drawImage(birdImage, birdX, birdY)

		// draw pipes
		ctx.fillStyle = '#333'
		ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY)
		ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY)


		//Collision check - if collision it returns true
		if (colissionCheck()) {
			endGame()
			return
		}

		//move pipe
		pipeX -= 1.5

		// reset pipe if it moves out from frame
		if (pipeX < -50) {
			pipeX = 400
			pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH
		}

		// move bird
		birdVelocity += birdAcceleration
		birdY += birdVelocity

		increaseScore()

		requestAnimationFrame(loop)
	}

	loop()
}