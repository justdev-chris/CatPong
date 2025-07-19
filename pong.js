```html name=index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple Pong Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Simple Pong Game</h1>
    <canvas id="pongCanvas" width="800" height="500"></canvas>
    <script src="pong.js"></script>
</body>
</html>
```

```css name=style.css
body {
    background: #222;
    color: #fff;
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 0;
    padding: 0;
}

h1 {
    margin: 20px 0;
}

#pongCanvas {
    background: #111;
    display: block;
    margin: 0 auto 30px auto;
    border: 2px solid #fff;
    box-shadow: 0 0 20px #000;
}
```

```javascript name=pong.js
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballSize = 16;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const playerX = 20;
const aiX = canvasWidth - paddleWidth - 20;
const paddleSpeed = 7;
const aiSpeed = 4;
const ballSpeedInit = 6;

// Game state
let playerY = (canvasHeight - paddleHeight) / 2;
let aiY = (canvasHeight - paddleHeight) / 2;
let ball = {
    x: canvasWidth / 2 - ballSize / 2,
    y: canvasHeight / 2 - ballSize / 2,
    vx: ballSpeedInit * (Math.random() > 0.5 ? 1 : -1),
    vy: ballSpeedInit * (Math.random() * 2 - 1)
};
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(canvasHeight - paddleHeight, playerY));
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([8, 16]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvasWidth / 4, 40);
    ctx.fillText(aiScore, canvasWidth * 3 / 4, 40);
}

// Game logic
function resetBall() {
    ball.x = canvasWidth / 2 - ballSize / 2;
    ball.y = canvasHeight / 2 - ballSize / 2;
    ball.vx = ballSpeedInit * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = ballSpeedInit * (Math.random() * 2 - 1);
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.vy *= -1;
    }
    if (ball.y + ballSize > canvasHeight) {
        ball.y = canvasHeight - ballSize;
        ball.vy *= -1;
    }

    // Paddle collision (player)
    if (
        ball.x < playerX + paddleWidth &&
        ball.y + ballSize > playerY &&
        ball.y < playerY + paddleHeight &&
        ball.x > playerX
    ) {
        ball.x = playerX + paddleWidth;
        ball.vx *= -1;

        // Add some spin based on where the ball hits the paddle
        let hitPos = (ball.y + ballSize / 2) - (playerY + paddleHeight / 2);
        ball.vy = hitPos * 0.25;
    }

    // Paddle collision (AI)
    if (
        ball.x + ballSize > aiX &&
        ball.y + ballSize > aiY &&
        ball.y < aiY + paddleHeight &&
        ball.x + ballSize < aiX + paddleWidth + ballSize
    ) {
        ball.x = aiX - ballSize;
        ball.vx *= -1;

        // Add some spin
        let hitPos = (ball.y + ballSize / 2) - (aiY + paddleHeight / 2);
        ball.vy = hitPos * 0.25;
    }

    // Score check
    if (ball.x + ballSize < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x > canvasWidth) {
        playerScore++;
        resetBall();
    }
}

function updateAI() {
    // Center of the AI paddle
    let aiCenter = aiY + paddleHeight / 2;

    // Move AI towards the ball, with a simple "reaction" delay
    if (aiCenter < ball.y + ballSize / 2 - 10) {
        aiY += aiSpeed;
    } else if (aiCenter > ball.y + ballSize / 2 + 10) {
        aiY -= aiSpeed;
    }
    // Clamp within canvas
    aiY = Math.max(0, Math.min(canvasHeight - paddleHeight, aiY));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawNet();
    drawScore();
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0f0");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f00");
    drawBall(ball.x, ball.y, ballSize, "#fff");

    updateBall();
    updateAI();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
```
