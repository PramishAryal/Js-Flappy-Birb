const birb = document.querySelector('#birb');

let posX = birb.getBoundingClientRect().left;
let posY = birb.getBoundingClientRect().top;
const playerW = birb.getBoundingClientRect().width;
const playerH = birb.getBoundingClientRect().height;
const pillerW = 100;
let pillerX = 0;

function createPiller(num) {
	const piller = document.createElement('div');
	let xCor = [ window.innerWidth ];
	pillerX = xCor;
	let yCor = 0;
	let height = Math.floor(Math.random() * 300) + 200;
	if (num == 2) {
		yCor = Math.floor(Math.random() * window.innerHeight / 2) + window.innerHeight / 2;
		height = 400;
	}
	piller.style.left = `${xCor}px`;
	piller.style.top = `${yCor}px`;
	piller.style.height = `${height}px`;
	return piller;
}

function createPillers() {
	const piller1 = createPiller(1);
	const piller2 = createPiller(2);
	return { piller1, piller2 };
}
let pillerThere = false;
let pillerOne, pillerTwo;

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

let intervalId = setInterval(gameLoop, 1000 / 60);

function gameOver() {
	clearInterval(intervalId);
	window.removeEventListener('click', handleInput);
}

function gameLoop() {
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
		pillerThere = false;
		document.body.removeChild(pillerOne);
		document.body.removeChild(pillerTwo);
	}
	pillerX -= 10;
	posY += 2.5;
	pillerOne.style.left = `${pillerX}px`;
	pillerTwo.style.left = `${pillerX}px`;
	birb.style.transform = `translate(${posX}px,${posY}px)`;
	if (isColliding()) {
		gameOver();
	}
}

window.addEventListener('click', handleInput);

function handleInput() {
	posY -= 50;
}
