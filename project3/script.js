/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

const ENEMY_NUMBER = 20;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "enemy4.png";

    // generates a random number between 0 and 4 and subtracts 2 from it, this means speed will be between -2 and 2
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 213;
    this.spriteHeight = 213;

    // this is done to maintain aspect ratio
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;

    this.frame = 0;

    // this makes sure that they spawn within the canvas
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);

    // new random position within the canvas
    this.newX = Math.random() * (canvas.width - this.width);
    this.newY = Math.random() * (canvas.height - this.height);

    // random number between 1 and 4, it is done not to include 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.interval = Math.floor(Math.random() * 200 + 50);
  }

  update() {
    // after a certain frame interval, calculate the new distance
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;

    this.x -= dx / 70;
    this.y -= dy / 70;

    // this creates a loop
    if (this.x + this.width < 0) this.x = canvas.width;

    // this will randomize the speed at which the frame is changed, the speed at which they flap their wings
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }

  draw() {
    // ctx.fillRect(this.x, this.y, this.width, this.height);
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

// this is used for circular radian movement by changing the values of sin and cos, also angle and angle speed
// class Enemy {
//   constructor() {
//     this.image = new Image();
//     this.image.src = "enemy3.png";

//     // generates a random number between 0 and 4 and subtracts 2 from it, this means speed will be between -2 and 2
//     this.speed = Math.random() * 4 + 1;
//     this.spriteWidth = 218;
//     this.spriteHeight = 177;

//     // this is done to maintain aspect ratio
//     this.width = this.spriteWidth / 2;
//     this.height = this.spriteHeight / 2;

//     this.frame = 0;

//     // this makes sure that they spawn within the canvas
//     this.x = Math.random() * (canvas.width - this.width);
//     this.y = Math.random() * (canvas.height - this.height);

//     // random number between 1 and 4, it is done not to include 0
//     this.flapSpeed = Math.floor(Math.random() * 3 + 1);

//     this.angle = 0;
//     this.angleSpeed = Math.random() * 0.5 + 0.5;

//     this.curve = Math.floor(Math.random() * 200 + 50);
//   }

//   update() {
//     this.x =
//       (canvas.width / 2) * Math.cos((this.angle * Math.PI) / 90) +
//       (canvas.width / 2 - this.width / 2);

//     this.y =
//       (canvas.height / 2) * Math.sin((this.angle * Math.PI) / 90) +
//       (canvas.width / 2 - this.width / 2);

//     this.angle += this.angleSpeed;

//     // this creates a loop
//     if (this.x + this.width < 0) this.x = canvas.width;

//     // this will randomize the speed at which the frame is changed, the speed at which they flap their wings
//     if (gameFrame % this.flapSpeed === 0) {
//       this.frame > 4 ? (this.frame = 0) : this.frame++;
//     }
//   }

//   draw() {
//     // ctx.fillRect(this.x, this.y, this.width, this.height);
//     ctx.drawImage(
//       this.image,
//       this.frame * this.spriteWidth,
//       0,
//       this.spriteWidth,
//       this.spriteHeight,
//       this.x,
//       this.y,
//       this.width,
//       this.height
//     );
//   }
// }

// this enemy class is for enemyType2 and for learning curvatious horizontal movement with Math.sin()
// class Enemy {
//   constructor() {
//     this.image = new Image();
//     this.image.src = "enemy2.png";

//     // generates a random number between 0 and 4 and subtracts 2 from it, this means speed will be between -2 and 2
//     this.speed = Math.random() * 4 + 1;
//     this.spriteWidth = 266;
//     this.spriteHeight = 188;

//     // this is done to maintain aspect ratio
//     this.width = this.spriteWidth / 2;
//     this.height = this.spriteHeight / 2;

//     this.frame = 0;

//     // this makes sure that they spawn within the canvas
//     this.x = Math.random() * (canvas.width - this.width);
//     this.y = Math.random() * (canvas.height - this.height);

//     // random number between 1 and 4, it is done not to include 0
//     this.flapSpeed = Math.floor(Math.random() * 3 + 1);

//     this.angle = 0;
//     this.angleSpeed = Math.random() * 0.2;

//     this.curve = Math.floor(Math.random() * 6);
//   }

//   update() {
//     this.x -= this.speed;

//     this.y += this.curve * Math.sin(this.angle);
//     this.angle += this.angleSpeed;

//     // this creates a loop
//     if (this.x + this.width < 0) this.x = canvas.width;

//     // this will randomize the speed at which the frame is changed, the speed at which they flap their wings
//     if (gameFrame % this.flapSpeed === 0) {
//       this.frame > 4 ? (this.frame = 0) : this.frame++;
//     }
//   }

//   draw() {
//     // ctx.fillRect(this.x, this.y, this.width, this.height);
//     ctx.drawImage(
//       this.image,
//       this.frame * this.spriteWidth,
//       0,
//       this.spriteWidth,
//       this.spriteHeight,
//       this.x,
//       this.y,
//       this.width,
//       this.height
//     );
//   }
// }

for (let i = 0; i < ENEMY_NUMBER; i++) {
  enemiesArray.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  enemiesArray.forEach((obj) => {
    obj.update();
    obj.draw();
  });

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
