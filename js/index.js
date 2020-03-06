 window.onload = () => {
   document.getElementById('start-button').onclick = () => {
     startGame();
   }
   /* INITIAL SETUP  canvas 300x500 */

   let myObstacles = [];
   let requestId = null

   const imgRoad = new Image()
   imgRoad.src = '../images/road.png';




   /* ==================================================================================== */
   /* GAME AREA */
   let myGameArea = {
     canvas: document.createElement("canvas"),
     frames: 0,

     start: function () {
       this.canvas.width = 500;
       this.canvas.height = 500;
       this.context = this.canvas.getContext("2d");
       document.body.insertBefore(this.canvas, document.body.childNodes[0]);
       // this.interval = setInterval(updateGameArea, 2);
       requestId = window.requestAnimationFrame(updateGameArea)



     },
     clear: function () {
       this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
       this.context.drawImage(imgRoad, 50, 80);
       this.context.drawImage(car, player.x, player.y, 50, 96);

     },
     stop: function () {
       // clearInterval(this.interval);
       window.cancelAnimationFrame(requestId)

     },
     score: function () {
       let points = Math.floor(this.frames / 5);
       this.context.font = "18px serif";
       this.context.fillStyle = "black";
       this.context.fillText("Score: " + points, 350, 50);
     }
   };

   /* ==================================================================================== */

   /* COMPONENTS */

   class Component {
     constructor(width, height, color, x, y) {
       this.width = width;
       this.height = height;
       this.color = color
       this.x = x;
       this.y = y;
       // new speed properties
       this.speedX = 0;
       this.speedY = 0;
     }

     update() {
       let ctx = myGameArea.context;
       // ctx.fillStyle = this.color;
       // ctx.fillRect(this.x, this.y, this.width, this.height);

     }
     newPos() {
       this.x += this.speedX;
       this.y += this.speedY;
     }


     left() {
       return this.x;
     }
     right() {
       return this.y + this.height;
     }


     crashWith(obstacle) {
       return !(
         this.bottom() < obstacle.top() ||
         this.top() > obstacle.bottom() ||
         this.right() < obstacle.left() ||
         this.left() > obstacle.right()
       );
     }

   }

   let player = new Component(300, 300, 'black', 166, 400)
   const car = new Image();
   car.src = '../images/car.png';

   function updateGameArea() {
     myGameArea.clear();
     player.newPos();
     player.update();
     updateObstacles();
     requestId = window.requestAnimationFrame(updateGameArea)
     checkGameOver();
     myGameArea.score();
   }

   /* START GAME */


   myGameArea.start();

   document.onkeydown = function (e) {
     switch (e.keyCode) {

       case 37: // left arrow
         if (player.x > 0)
           player.speedX -= 1

         break;
       case 39: // right arrow
         player.speedX += 1;
         break;
     }
   };

   document.onkeyup = function (e) {
     player.speedX = 0;
     player.speedY = 0;
   };

   /* ==================================================================================== */

   /* OBSTACLES */

   function updateObstacles() {
     for (i = 0; i < myObstacles.length; i++) {
       myObstacles[i].y += 1;
       myObstacles[i].update();
     }
     myGameArea.frames += 1;
     if (myGameArea.frames % 120 === 0) {
       let x = myGameArea.canvas.width;
       let minHeight = 20;
       let maxHeight = 200;
       let height = Math.floor(
         Math.random() * (maxHeight - minHeight + 1) + minHeight
       );
       let minGap = 50;
       let maxGap = 200;
       let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
       myObstacles.push(new Component(height, 10, "green", 250, 0));
       myObstacles.push(
         new Component(x + height + gap, 10, "black", 550, height - gap)
       );
     }
   }

   function checkGameOver() {
     let crashed = myObstacles.some(function (obstacle) {
       return player.crashWith(obstacle);
     });
     if (crashed) {
       myGameArea.stop();
     }
   }

   function startGame() {
     this.context.drawImage(imgRoad, 50, 80);
     this.context.drawImage(car, player.x, player.y, 50, 96);
   }
 }