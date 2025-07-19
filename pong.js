window.onload = function() {
  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  const paddleWidth = 10, paddleHeight = 100, ballSize = 40;
  const player = { x: 0, y: canvas.height/2 - paddleHeight/2, score: 0 };
  const ai = { x: canvas.width - paddleWidth, y: canvas.height/2 - paddleHeight/2, score: 0 };
  const aiSpeed = 5;

  const ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 5 * (Math.random() > 0.5 ? 1 : -1)
  };

  function resetBall(direction = 1) {
    ball.x = canvas.width/2 - ballSize/2;
    ball.y = canvas.height/2 - ballSize/2;
    ball.vx = 5 * direction;
    ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
  }

  function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCatBall(x, y) {
    ctx.font = `${ballSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🐱", x + ballSize/2, y + ballSize/2);
  }

  function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(player.score, canvas.width/4, 20);
    ctx.fillText(ai.score, 3*canvas.width/4, 20);
  }

  function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    // Net
    for(let i=0; i<canvas.height; i+=30)
      drawRect(canvas.width/2-2, i, 4, 20, "#fff");
    // Paddles (green)
    drawRect(player.x, player.y, paddleWidth, paddleHeight, "#0f0");
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "#0f0");
    // Ball (Cat)
    drawCatBall(ball.x, ball.y);
    // Scores
    drawScore();
  }

  function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off top and bottom
    if (ball.y < 0 || ball.y + ballSize > canvas.height) ball.vy *= -1;

    // Bounce off paddles
    if (
      ball.x < player.x + paddleWidth &&
      ball.y + ballSize > player.y &&
      ball.y < player.y + paddleHeight
    ) {
      ball.vx *= -1;
      ball.x = player.x + paddleWidth; // prevent sticking
    }
    if (
      ball.x + ballSize > ai.x &&
      ball.y + ballSize > ai.y &&
      ball.y < ai.y + paddleHeight
    ) {
      ball.vx *= -1;
      ball.x = ai.x - ballSize; // prevent sticking
    }

    // Score and reset
    if (ball.x < 0) {
      ai.score += 1;
      resetBall(-1);
    }
    if (ball.x + ballSize > canvas.width) {
      player.score += 1;
      resetBall(1);
    }

    // Simple AI: follow ball, but limit speed
    const aiCenter = ai.y + paddleHeight / 2;
    const ballCenter = ball.y + ballSize / 2;
    if (aiCenter < ballCenter - 10) {
      ai.y += aiSpeed;
    } else if (aiCenter > ballCenter + 10) {
      ai.y -= aiSpeed;
    }
    // Clamp AI paddle within canvas
    ai.y = Math.max(Math.min(ai.y, canvas.height - paddleHeight), 0);
  }

  // Player paddle movement
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

  gameLoop();
};
