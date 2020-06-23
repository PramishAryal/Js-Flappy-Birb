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
document.body.append(Score);
let intScore = 0;
//pseudo time to calculate score
let pseudoTimer = 0.0;
///piller stuff
const pillerW = 100;
let pillerX = 0;
let pillerThere = false; //if piller is present no creation takes place other wise you know, it takes place
let pillerOne, pillerTwo; //Needed a global object cuz I don't seem to understand how to exploit destructuring
//cloud1
const noOfClouds = 10;
// let cloud1PosX;
// let cloud1PosY;
// let cloud2PosX;
// let cloud2PosY;
// let cloud3PosX;
// let cloud3PosY;
function createCloud() {
	const cloud = document.createElement('div');
	cloud.classList.add('cloud');
	cloud.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
	cloud.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
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

// let cloud1 = createCloud();
// let cloud2 = createCloud();
// let cloud3 = createCloud();

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
}
// let cloud1There = false;
// let cloud2There = false;
// let cloud3There = false;

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
	posY += 2.5;
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
	posY -= 50;
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

//prev code to manipulate clouds
// if (!cloud1There) {
// 	cloud1PosY = Math.floor(Math.random() * window.innerHeight);
// 	cloud1PosX = window.innerWidth;
// 	cloud1There = true;
// }
// if (cloud1PosX + 400 < 0) {
// 	cloud1There = false;
// }
// cloud1PosX -= 2.5;
// cloud1.style.left = `${cloud1PosX}px`;
// cloud1.style.top = `${cloud1PosY}px`;

// if (!cloud2There) {
// 	cloud2PosY = Math.floor(Math.random() * window.innerHeight);
// 	cloud2PosX = window.innerWidth;
// 	cloud2There = true;
// }
// if (cloud2PosX + 400 < 0) {
// 	cloud2There = false;
// }
// cloud2PosX -= 7.5;
// cloud2.style.left = `${cloud2PosX}px`;
// cloud2.style.top = `${cloud2PosY}px`;

// if (!cloud3There) {
// 	cloud3PosY = Math.floor(Math.random() * window.innerHeight);
// 	cloud3PosX = window.innerWidth;
// 	cloud3There = true;
// }
// if (cloud3PosX + 400 < 0) {
// 	cloud3There = false;
// }
// cloud3PosX -= 0.5;
// cloud3.style.left = `${cloud3PosX}px`;
// cloud3.style.top = `${cloud3PosY}px`;
