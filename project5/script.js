/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "50px Impact";

let score = 0;
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
    this.flapInterval = Math.random() * 50 + 50;
  }

  update(deltaTime) {
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
  }

  draw() {
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

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText(`Score:- ${score}`, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText(`Score:- ${score}`, 55, 80);
}

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   time passed between frames
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }

  drawScore();
  [...ravens].forEach((e) => e.update(deltaTime));
  [...ravens].forEach((e) => e.draw());

  ravens.filter((e) => !e.markedForDeletion);

  requestAnimationFrame(animate);
}

animate(0);
