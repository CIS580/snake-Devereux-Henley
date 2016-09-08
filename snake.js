/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var moveTimeCounter = 0;
var updatePeriod = 100;
var bodSize = 100;
var speed = 15;

var oneTrueFood = new food();

function food() {
	this.img = new Image();
	this.img.src = 'snakebod.svg';
	this.position = new position(Math.floor(Math.random() * backBuffer.width), Math.floor(Math.random() * backBuffer.height));
}

function snakeLink(direction,position,img,prev,next) {
	this.direction = direction;
	this.position = position;
	this.img = new Image();
	this.img.src = img;
	this.prev = prev;
	this.next = next;
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

var firstNode = new snakeLink(
	new direction(false,true,false,false),
	new position(200,200),
	'snakebod.svg',
	null,
	null
);
var snake = {
	head: firstNode,
	tail: firstNode,
	length: 1
}

for(i=0;i<10;i++){appendNewTail();}

var input = new direction(false,false,false,false);

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

	// TODO: Spawn an apple periodically
	// TODO: Grow the snake periodically
	// TODO: Move the snake

	
	if(checkInput(input)) copyDirection(snake.head.direction, input);
	
	moveTimeCounter += elapsedTime;
	if(moveTimeCounter > updatePeriod){ 
		moveSnakeHead();
		moveTimeCounter = 0;
   	}	

	 // TODO: Determine if the snake has moved out-of-bounds (offscreen)
	// TODO: Determine if the snake has eaten an apple
	// TODO: Determine if the snake has eaten its tail
	// TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

function appendNewTail() {
	var newSnakeNode = new snakeLink(
		new direction(snake.tail.direction.up, snake.tail.direction.down, snake.tail.direction.left, snake.tail.direction.right),
		getNewTailPosition(),
		'snakebod.svg',
		snake.tail,
		null
	)

	snake.tail.next = newSnakeNode;
	snake.tail = newSnakeNode;
	snake.length++;
}

function getNewTailPosition() {
	if(snake.tail.direction.up) {
		return new position(snake.tail.position.x, snake.tail.position.y + 10);
	}
	else if (snake.tail.direction.down) {
		return new position(snake.tail.position.x, snake.tail.position.y - 10);
	}
	else if (snake.tail.direction.left) {
		return new position(snake.tail.position.x + 10, snake.tail.position.y);
	}
	else if (snake.tail.direction.right) {
		return new position(snake.tail.position.x - 10, snake.tail.position.y);
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

	/**
	 * @function render
	 * Renders the current game state into a back buffer.
	 * @param {elapsedTime} A DOMHighResTimeStamp indicting
	 * the number of milliseconds passed since the last frame.
	 */
function render(elapsedTime) {
	backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
	var snakeNode = snake.head;
	backCtx.drawImage(oneTrueFood.img, oneTrueFood.position.x, oneTrueFood.position.y);
	while(snakeNode != null) {
		backCtx.drawImage(snakeNode.img, snakeNode.position.x, snakeNode.position.y);
		snakeNode = snakeNode.next;
	}	
	// TODO: Draw the game objects into the backBuffer

}

/* Launch the game */
window.requestAnimationFrame(loop);
