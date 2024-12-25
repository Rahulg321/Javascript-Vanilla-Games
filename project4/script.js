/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

let canvasPosition = canvas.getBoundingClientRect();

let rect1 = {
  x: 5,
  y: 5,
  width: 50,
  height: 50,
};

let rect2 = {
  x: 20,
  y: 30,
  width: 200,
  height: 120,
};

// Example usage:
let circle1 = {
  x: 10,
  y: 20,
  radius: 10,
};

let circle2 = {
  x: 30,
  y: 35,
  radius: 20,
};

function doRectanglesCollide(rect1, rect2) {
  // Check for x-axis overlap
  const xOverlap =
    rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width;

  // Check for y-axis overlap
  const yOverlap =
    rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height;

  // Return true if there is overlap on both axes, false otherwise
  return xOverlap && yOverlap;
}

function doCirclesCollide(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;

  let distance = Math.sqrt(dx * dx - dy * dy);

  let sumOfRadii = circle1.radius + circle2.radius;

  return distance <= sumOfRadii;
}

console.log("rectangles collide", doRectanglesCollide(rect1, rect2));

console.log("circles collide", doCirclesCollide(circle1, circle2));

let explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;

    this.width = this.spriteWidth * 0.7;
    this.height = this.spriteHeight * 0.7;

    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = "boom.png";

    // cycling towards explosion
    this.frame = 0;

    this.timer = 0;
    this.angle = Math.random() * 6.2;

    this.sound = new Audio();
    this.sound.src = "boom.wav";
  }

  update() {
    this.timer++;

    if (this.frame === 0) {
      // when frame is 0 it means that the object is just created
      this.sound.play();
    }

    if (this.timer % 7 === 0) {
      this.frame++;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.spriteHeight * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2,
      0 - this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

window.addEventListener("click", function (e) {
  createAnimation(e);
});

// window.addEventListener("mousemove", function (e) {
//   createAnimation(e);
// });

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;

  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();

    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

animate();
