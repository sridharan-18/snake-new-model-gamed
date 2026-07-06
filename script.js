const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

const tileSize = 20;
const boardSize = canvas.width / tileSize;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let running = true;
let gameLoop = null;

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  running = true;
  placeFood();
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
  }
  gameLoop = requestAnimationFrame(loop);
}

function placeFood() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));

  food = position;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;
  for (let i = 0; i <= boardSize; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80';
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 1, tileSize - 1);
  });
}

function drawFood() {
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, tileSize / 2.2, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  if (!running) {
    return;
  }

  direction = nextDirection;
  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  const isEating = head.x === food.x && head.y === food.y;
  const collisionCheck = isEating ? snake : snake.slice(0, -1);

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= boardSize ||
    head.y >= boardSize ||
    collisionCheck.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    running = false;
    return;
  }

  snake.unshift(head);

  if (isEating) {
    score += 1;
    scoreEl.textContent = score.toString();
    placeFood();
  } else {
    snake.pop();
  }
}

function render() {
  drawBoard();
  drawFood();
  drawSnake();
}

function loop() {
  update();
  render();
  if (running) {
    gameLoop = requestAnimationFrame(loop);
  }
}

function setDirection(x, y) {
  if (x === -direction.x && y === -direction.y) {
    return;
  }
  nextDirection = { x, y };
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      setDirection(0, -1);
      break;
    case 'ArrowDown':
      event.preventDefault();
      setDirection(0, 1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      setDirection(-1, 0);
      break;
    case 'ArrowRight':
      event.preventDefault();
      setDirection(1, 0);
      break;
    default:
      break;
  }
});

restartButton.addEventListener('click', () => {
  resetGame();
});

resetGame();
