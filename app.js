//create Birb and get its dimensions
const birb = document.querySelector('#birb');
let posX = birb.getBoundingClientRect().left;
let posY = birb.getBoundingClientRect().top;
const playerW = birb.getBoundingClientRect().width;
const playerH = birb.getBoundingClientRect().height;
//Frame Limiter
let fps = 1000 / 60;
//Score
const Score = document.createElement('h1');
Score.innerText = 'Score:0';
Score.style.color = '#273F50';
document.body.append(Score);
let intScore = 0;
//pseudo time to calculate score
let pseudoTimer = 0.0;
///piller stuff
const pillerW = 100;
let pillerX = 0;
let pillerThere = false; //if piller is present no creation takes place other wise you know, it takes place
let pillerOne, pillerTwo; //Needed a global object cuz I don't seem to understand how to exploit destructuring

//Clouds
const noOfClouds = 20;

function createCloud() {
	const cloud = document.createElement('div');
	cloud.classList.add('cloud');
	cloud.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
	cloud.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
	cloud.style.width = `${Math.floor(Math.random() * 500) + 400}`;
	cloud.style.height = `${Math.floor(Math.random() * 200) + 200}`;
	document.body.prepend(cloud);
	return cloud;
}

let cloudsPosX = [];
for (let i = 0; i < noOfClouds; i++) {
	cloudsPosX.push(0);
}
let cloudsPosY = [];
for (let i = 0; i < noOfClouds; i++) {
	cloudsPosY.push(0);
}
let clouds = [];
for (let i = 0; i < noOfClouds; i++) {
	clouds.push(createCloud());
}
let cloudsThere = [];
for (let i = 0; i < noOfClouds; i++) {
	cloudsThere.push(false);
}
//The allmighty piller creator, takes in num 2 or other just to seperate between top and bottom piller
function createPiller(num) {
	const piller = document.createElement('div');
	let xCor = [ window.innerWidth ];
	pillerX = xCor;
	let yCor = 0;
	let height = Math.floor(Math.random() * 0.7 * window.innerHeight / 2) + 50;
	if (num === 2) {
		yCor = Math.floor(Math.random() * 0.5 * window.innerHeight / 2) + window.innerHeight / 2;
		//yCor <= 500 ? yCor + 100 : yCor;
		height = window.innerHeight / 2;
	}
	piller.style.left = `${xCor}px`;
	piller.style.top = `${yCor}px`;
	piller.style.height = `${height}px`;
	return piller;
}
//The not so allmighty uses the THE ALLMIGHTY createPiller to create two pillers, 2 for the bottom and any other num for the top and
//returns an object of the two pillers
function createPillers() {
	const piller1 = createPiller(1);
	const piller2 = createPiller(2);
	return {
		piller1,
		piller2
	};
}
//Checks if the birb is colliding with any of the two pillers or with the top/bottom of the screen and returns the resulting bool
function isColliding() {
	const piller1H = parseInt(pillerOne.style.height);
	const piller1X = parseInt(pillerOne.style.left);
	const piller1Y = parseInt(pillerOne.style.top);

	const piller2H = parseInt(pillerTwo.style.height);
	const piller2X = parseInt(pillerTwo.style.left);
	const piller2Y = parseInt(pillerTwo.style.top);

	let gOver =
		(posX < piller1X + pillerW &&
			posY < piller1Y + piller1H &&
			posX + playerW > piller1X &&
			posY + playerH > piller1Y) ||
		(posX < piller1X + pillerW &&
			posY < piller2Y + piller2H &&
			posX + playerW > piller2X &&
			posY + playerH > piller2Y) ||
		posY + playerH > window.innerHeight ||
		posY < 0;
	return gOver;
}
//Aah yes the main hero, the thing that's holding everything together, without this bad boi to loop the gameLoop nothing would run...
let intervalId = setInterval(gameLoop, fps);

//runs when game is over, clears most of the things and removes the event listeners essentially freezing the game
function gameOver() {
	clearInterval(intervalId);
	window.removeEventListener('click', handleInput);
	Score.style.display = 'none';
	const Over = document.createElement('h1');
	Over.innerHTML = `<h1>Game Over</h1>You scored: ${intScore}`;
	Over.classList.add('gameOver');

	setTimeout(() => (birb.style.display = 'none'), 500);
	setTimeout(() => (pillerOne.style.display = 'none'), 1000);
	setTimeout(() => (pillerTwo.style.display = 'none'), 1000);
	setTimeout(() => document.body.prepend(Over), 500);
	setTimeout(() => {
		for (let index = 0; index < noOfClouds; index++) {
			clouds[index].style.display = 'none';
		}
	}, 1500);

	const playAgain = document.createElement('button');
	playAgain.innerText = 'Play Again?';
	playAgain.classList.add('playAgain');
	playAgain.addEventListener('click', () => location.reload());
	setTimeout(() => document.body.append(playAgain), 2000);
}
//The game loop
function gameLoop() {
	pseudoTimer += 1 / fps;
	if (pseudoTimer >= 1.5) {
		intScore++;
		pseudoTimer = 0;
	}

	if (!pillerThere) {
		const { piller1, piller2 } = createPillers();
		pillerOne = piller1;
		pillerTwo = piller2;
		piller1.classList.add('piller');
		piller2.classList.add('piller');
		document.body.append(piller1);
		document.body.append(piller2);
		pillerThere = true;
	}
	if (pillerX + pillerW + 20 < 0) {
		pillerX = window.innerWidth;
		document.body.removeChild(pillerOne);
		document.body.removeChild(pillerTwo);
		pillerThere = false;
	}
	for (let index = 0; index < noOfClouds; index++) {
		cloudCompute(index);
	}
	pillerX -= 10;
	posY += 3.5;
	pillerOne.style.left = `${pillerX}px`;
	pillerTwo.style.left = `${pillerX}px`;
	birb.style.transform = `translate(${posX}px,${posY}px)`;
	Score.innerText = `Score:${intScore}`;
	if (isColliding()) {
		gameOver();
	}
}

//Input handler
window.addEventListener('click', handleInput);
//Couldnt use an anon function in the eventlistener to remove it when game is over
function handleInput() {
	posY -= 100;
}

function cloudCompute(i) {
	if (!cloudsThere[i]) {
		cloudsPosY[i] = Math.floor(Math.random() * window.innerHeight * 0.8);
		cloudsThere[i] = true;
		if (cloudsPosX[i] === 0) {
			cloudsPosX[i] = Math.floor(Math.random() * window.innerWidth);
		} else {
			cloudsPosX[i] = window.innerWidth;
		}
	}
	if (cloudsPosX[i] + 400 < 0) {
		cloudsThere[i] = false;
	}
	const decrement = i * 4.2 / 6.9;
	cloudsPosX[i] -= decrement;
	clouds[i].style.left = `${cloudsPosX[i]}px`;
	clouds[i].style.top = `${cloudsPosY[i]}px`;
}
