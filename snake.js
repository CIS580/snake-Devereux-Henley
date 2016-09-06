/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

function snakeLink(direction,position,img,next) {
	this.direction = direction;
	this.position = position;
	this.img = new Image(50,50);
	this.img.src = img;
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

var snake = {
	head: new snakeLink(
		new direction(false,true,false,false),
		new position(0,0),
		'snakebod.svg',
		null
	),
  	length: 1
}

snake.head.next = new snakeLink(
	snake.head.direction,
	new position(snake.head.position.x, snake.head.position.y - 10),
	'snakebod.svg',
	null
)

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
	
	console.log(snake);
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
	var snakeNode = snake.head;
	while(snakeNode.next != null) {
		moveSnakeNode(snakeNode.next);
		snakeNode.next.direction = snakeNode.direction;
		snakeNode = snakeNode.next;
	}
	snake.head.direction = input;
	moveSnakeNode(snake.head);
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

function moveSnakeNode(snakeNode) {
	if(snakeNode.direction.up) snakeNode.position.y-=1;
	else if (snakeNode.direction.down) snakeNode.position.y+=1;
	else if (snakeNode.direction.left) snakeNode.position.x-=1;
	else if (snakeNode.direction.right) snakeNode.position.x+=1;
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
	while(snakeNode != null) {
		backCtx.drawImage(snakeNode.img, snakeNode.position.x, snakeNode.position.y);
		snakeNode = snakeNode.next;
	}	
  // TODO: Draw the game objects into the backBuffer

}

/* Launch the game */
window.requestAnimationFrame(loop);
