// window.onload = () => {
//   document.getElementById('start-button').onclick = () => {
//     startGame();
//   };
/* SETTING CANVAS*/


let obstacles = [];
let requestId = null


/* ==================================================================================== */
let gameArea = {


    canvas: document.createElement("canvas"),
    frames: 0,

    start: function () {
        this.canvas.width = 900;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        requestId = window.requestAnimationFrame(updateGameArea)
    },
    /* CLEARING CANVAS*/
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /* Stop Car Interval */
    stop: function () {
        // clearInterval(this.interval);
        window.cancelAnimationFrame(requestId);

    },
    /*GAME SCORE AREA */
    score: function () {
        var points = Math.floor(this.frames / 5);
        this.context.font = "18px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Score: " + points, 350, 50);
    }
}
/* ==================================================================================== */
/* COMPONENTS */

class Components {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y

    }
    update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    left() {
        return this.x - this.width;
    }
    right() {
        return this.x;
    }


}



/* ==================================================================================== */

let player = new Component(30, 30, "red", 0, 110);

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
            if (player.x > 0) {
                player.speedX -= 1;
                break;
            }
            case 39: // right arrow
                player.speedX += 1;
                break;
    }
};

document.onkeyup = function (e) {
    player.speedX = 1;
    player.speedY = 1;
};

/* OBSTACLES */

function updateObstacles() {
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGameArea.frames += 1;
    if (myGameArea.frames % 120 === 0) {
        var x = myGameArea.canvas.width;
        var minHeight = 20;
        var maxHeight = 200;
        var height = Math.floor(
            Math.random() * (maxHeight - minHeight + 1) + minHeight
        );
        var minGap = 50;
        var maxGap = 200;
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(
            new Component(10, x - height - gap, "green", x, height + gap)
        );
    }
}

function checkGameOver() {
    var crashed = myObstacles.some(function (obstacle) {
        return player.crashWith(obstacle);
    });

    if (crashed) {
        myGameArea.stop();
    }
}