// handles game logic lol

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100, ballSize = 40;
const player = { x: 0, y: canvas.height/2 - paddleHeight/2, score: 0 };
const ai = { x: canvas.width - paddleWidth, y: canvas.height/2 - paddleHeight/2, score: 0 };

const ball = {
  x: canvas.width/2 - ballSize/2,
  y: canvas.height/2 - ballSize/2,
  vx: 6 * (Math.random() > 0.5 ? 1 : -1),
  vy: 6 * (Math.random() > 0.5 ? 1 : -1),
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawText(text, x, y) {
  ctx.fillStyle = "#fff";
  ctx.font = "40px Arial";
  ctx.fillText(text, x, y);
}

function drawCatBall(x, y) {
  ctx.font = `${ballSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐱", x + ballSize/2, y + ballSize/2);
}

function resetBall() {
  ball.x = canvas.width/2 - ballSize/2;
  ball.y = canvas.height/2 - ballSize/2;
  ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 6 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#222");
  // Net
  for(let i=0; i<canvas.height; i+=30)
    drawRect(canvas.width/2-2, i, 4, 20, "#fff");
  // Paddles
  drawRect(player.x, player.y, paddleWidth, paddleHeight, "#fff");
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "#fff");
  // Scores
  drawText(player.score, canvas.width/4, 50);
  drawText(ai.score, 3*canvas.width/4, 50);
  // Ball (Cat)
  drawCatBall(ball.x, ball.y);
}

function update() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collide top/bottom
  if (ball.y < 0 || ball.y + ballSize > canvas.height) ball.vy = -ball.vy;

  // Collide with paddles
  if (
    ball.x < player.x + paddleWidth &&
    ball.y + ballSize > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.vx = -ball.vx;
    ball.x = player.x + paddleWidth;
  }

  if (
    ball.x + ballSize > ai.x &&
    ball.y + ballSize > ai.y &&
    ball.y < ai.y + paddleHeight
  ) {
    ball.vx = -ball.vx;
    ball.x = ai.x - ballSize;
  }

  // AI simple movement
  if (ai.y + paddleHeight/2 < ball.y + ballSize/2) ai.y += 6;
  else ai.y -= 6;
  ai.y = Math.max(Math.min(ai.y, canvas.height - paddleHeight), 0);

  // Score
  if (ball.x < 0) {
    ai.score++;
    resetBall();
  }
  if (ball.x + ballSize > canvas.width) {
    player.score++;
    resetBall();
  }
}

canvas.addEventListener("mousemove", function(evt) {
  const rect = canvas.getBoundingClientRect();
  player.y = evt.clientY - rect.top - paddleHeight/2;
  player.y = Math.max(Math.min(player.y, canvas.height - paddleHeight), 0);
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();
