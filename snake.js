/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
backCtx.font = '20px Arial';
var oldTime = performance.now();

var upperBounds = new position(backBuffer.width,backBuffer.height);
var gameDone = false;

var moveTimeCounter = 0;
var updatePeriod = 60;

var snakeSize = 15;
var snakeImage = 'snakebod.svg';

var foodSize = 20;
var foodImage = 'food.svg';
var speed = 15;
var score;

var foodOnScreen = new food(foodImage, new position(randomizePos(backBuffer.width - foodSize), randomizePos(backBuffer.height - foodSize)), foodSize);

var firstNode;
var snake;

var input;

init();

function init() {
	score = 0;
	
	firstNode = new snakeLink(
		new direction(false,true,false,false),
		new position(200,200),
		snakeImage,
		null,
		null,
		snakeSize
);
	
	snake = {
		head: firstNode,
		tail: firstNode,
		length: 1
	};

	input = new direction(false,false,false,false);
	for(i=0;i<4;i++){appendNewTail();}	
}

function food(img, pos, size) {
	this.img = new Image();
	this.img.src = img;
	this.position = pos;
	this.size = size;
}

function snakeLink(direction,position,img,prev,next,size) {
	this.direction = direction;
	this.position = position;
	this.img = new Image();
	this.img.src = img;
	this.prev = prev;
	this.next = next;
	this.size = size;
}

function direction(up, down, left, right) {
	this.up = up;
	this.down = down;
	this.left = left;
	this.right = right;
}

function position(x, y) {
	this.x = x;
	this.y = y;
}

window.onkeydown = function(event) {
	switch (event.key) {
		case "ArrowDown":
			event.preventDefault();
			input.down = true;
			break;
		case "ArrowLeft":
			event.preventDefault();
			input.left = true;
			break;
		case "ArrowRight":
			event.preventDefault();
			input.right = true;
			break;
		case "ArrowUp":
			event.preventDefault();
			input.up = true;
			break;
		default:
			return;
	}
}

window.onkeyup = function(event) {
	switch (event.key) {
		case "ArrowDown":
			event.preventDefault();
			input.down = false;
			break;
		case "ArrowLeft":
			event.preventDefault();
			input.left = false;
			break;
		case "ArrowRight":
			event.preventDefault();
			input.right = false;
			break;
		case "ArrowUp":
			event.preventDefault();
			input.up = false;
			break;
		default:
			return;
	}
}

	/**
	 * @function loop
	 * The main game loop.
	 * @param{time} the current time as a DOMHighResTimeStamp
	 */
function loop(newTime) {
	var elapsedTime = newTime - oldTime;
	oldTime = newTime;

	update(elapsedTime);
	render(elapsedTime);
	
	// Flip the back buffer
	frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
	frontCtx.drawImage(backBuffer, 0, 0);

	// Run the next loop
	window.requestAnimationFrame(loop);
}

	/**
	 * @function update
	 * Updates the game state, moving
	 * game objects and handling interactions
	 * between them.
	 * @param {elapsedTime} A DOMHighResTimeStamp indicting
	 * the number of milliseconds passed since the last frame.
	 */
function update(elapsedTime) {

	if(checkOutOfBounds()) {
		gameDone = true;
		return;
	}

	var currentSnakeNode = snake.head.next;
	while(currentSnakeNode != null) {
		if(checkCollision(snake.head, currentSnakeNode.position, currentSnakeNode.size)) {
			gameDone = true;
			return;
		}
		else if(snake.head.position.x == currentSnakeNode.position.x && snake.head.position.y == currentSnakeNode.position.y) {
			gameDone = true;
			return;
		}
		currentSnakeNode = currentSnakeNode.next;
	}

	if(checkCollision(snake.head, foodOnScreen.position, foodOnScreen.size)) {
		foodOnScreen = new food(foodImage, new position(randomizePos(backBuffer.width - foodSize), randomizePos(backBuffer.height - foodSize)), foodSize);
		appendNewTail();
		score += 1;	
	}	

	if(checkInput(input)) copyDirection(snake.head.direction, input);
	
	moveTimeCounter += elapsedTime;
	if(moveTimeCounter > updatePeriod){ 
		moveSnakeHead();
		moveTimeCounter = 0;
   	}	
	// TODO: [Extra Credit] Determine if the snake has run into an obstacle

}


	/**
	 * @function render
	 * Renders the current game state into a back buffer.
	 * @param {elapsedTime} A DOMHighResTimeStamp indicting
	 * the number of milliseconds passed since the last frame.
	 */
function render(elapsedTime) {	
	backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

	if(gameDone) {
		backCtx.fillText('GAME OVER. Score is ' + score, backBuffer.width/3, backBuffer.height/2);
		return;
	}

	var snakeNode = snake.head;
	backCtx.drawImage(foodOnScreen.img, foodOnScreen.position.x, foodOnScreen.position.y);
	while(snakeNode != null) {
		backCtx.drawImage(snakeNode.img, snakeNode.position.x, snakeNode.position.y);
		snakeNode = snakeNode.next;
	}

	backCtx.fillText('Score is ' + score, backBuffer.width - 150, 30);	
}


function checkCollision(snakeNode, pos, offset) {
	var snakeBot = snakeNode.position.y + snakeNode.size;
	var snakeRight = snakeNode.position.x + snakeNode.size;

	var rightX = pos.x + offset;
	var botY = pos.y + offset;

	if((pos.y < snakeNode.position.y && snakeNode.position.y < botY) && (pos.x < snakeNode.position.x && snakeNode.position.x < rightX)) {
		return true;
	}
	else if ((pos.y < snakeBot && snakeBot < botY) && (pos.x < snakeRight && snakeRight < rightX)) {
		return true;
	}
	else return false;
}

function checkOutOfBounds() {
	if (snake.head.position.x >= upperBounds.x 
		|| snake.head.position.x <= 0
		|| snake.head.position.y >= upperBounds.y
		|| snake.head.position.y <= 0) 
	{
		return true;
	}
	else return false;
}

function appendNewTail() {
	var newSnakeNode = new snakeLink(
		new direction(snake.tail.direction.up, snake.tail.direction.down, snake.tail.direction.left, snake.tail.direction.right),
		getNewTailPosition(),
		'snakebod.svg',
		snake.tail,
		null,
		snakeSize
	)

	snake.tail.next = newSnakeNode;
	snake.tail = newSnakeNode;
	snake.length++;
}

function getNewTailPosition() {
	if(snake.tail.direction.up) {
		return new position(snake.tail.position.x, snake.tail.position.y + 15);
	}
	else if (snake.tail.direction.down) {
		return new position(snake.tail.position.x, snake.tail.position.y - 15);
	}
	else if (snake.tail.direction.left) {
		return new position(snake.tail.position.x + 15, snake.tail.position.y);
	}
	else if (snake.tail.direction.right) {
		return new position(snake.tail.position.x - 15, snake.tail.position.y);
	}
}

function copyDirection(target, source) {	
	target.up = source.up;
	target.down = source.down;
	target.left = source.left;
	target.right = source.right;
	return target;
}

function copyObject(target, source) {
	for (var prop in target) {
		target[prop] = source[prop];
	}
	return target;
}

function checkInput(inputDirection) {
	if(inputDirection.up || inputDirection.down || inputDirection.left || inputDirection.right) {
		return true;
	}
	return false;
}

function randomizePos(input) {
	return Math.floor(Math.random() * input);
}

function moveSnakeHead() {
	var snakePos = copyObject(new position(0,0), snake.head.position);

	if(snake.head.direction.up) snake.head.position.y -= speed;
	else if (snake.head.direction.down) snake.head.position.y += speed;
	else if (snake.head.direction.left) snake.head.position.x -= speed;
	else if (snake.head.direction.right) snake.head.position.x += speed;
	else console.log('movement error');

	moveSnake(snakePos, snake.head.next);
}

function moveSnake(pos, snakeNode) {
	if (snakeNode == null) return;	
	moveSnake(snakeNode.position, snakeNode.next);
	copyObject(snakeNode.position, pos);
}

/* Launch the game */
window.requestAnimationFrame(loop);
