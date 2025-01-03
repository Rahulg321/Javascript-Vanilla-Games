/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**  @type {HTMLCanvasElement} */
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");

collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

ctx.font = "50px Impact";

let score = 0;
let gameOver = false;
let ravens = [];

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;

    this.sizeModifier = Math.random() * 0.6 + 0.4;

    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);

    // horizontal and vertical speeds
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;

    this.image = new Image();
    this.image.src = "raven.png";

    this.frame = 0;
    this.maxFrame = 4;

    this.timeSinceFlap = 0;

    // random value between 50 and 100
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
  }

  update(deltaTime) {
    // if it touches the top of the screen
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = -this.directionY;
    }

    this.x -= this.directionX;
    this.y += this.directionY;

    if (this.x < 0 - this.width) this.markedForDeletion = true;

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;

      this.timeSinceFlap = 0;
    }

    // if any raven crosses over without being clicked
    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];

class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "boom.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play();

    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText(`Score:- ${score}`, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText(`Score:- ${score}`, 55, 80);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    `GAME OVER, your score is ${score}`,
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    `GAME OVER, your score is ${score}`,
    canvas.width / 2 + 5,
    canvas.height / 2 + 5
  );
}

window.addEventListener("click", (object) => {
  // we are scanning just one pixel color
  const detectPixelColor = collisionCtx.getImageData(object.x, object.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  console.log(pc);
  ravens.forEach((e) => {
    if (
      e.randomColors[0] === pc[0] &&
      e.randomColors[1] === pc[1] &&
      e.randomColors[2] === pc[2]
    ) {
      // detects collision by color
      e.markedForDeletion = true;
      score++;

      explosions.push(new Explosion(e.x, e.y, e.width));
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  //   time passed between frames
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;

    // large ravens are on top and smaller ravens are on the bottom
    ravens.sort((a, b) => {
      return a.width - b.width;
    });
  }

  drawScore();
  [...ravens, ...explosions].forEach((e) => e.update(deltaTime));
  [...ravens, ...explosions].forEach((e) => e.draw());

  ravens = ravens.filter((e) => !e.markedForDeletion);
  explosions = explosions.filter((e) => !e.markedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}

animate(0);
