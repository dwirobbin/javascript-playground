const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
};
const MOVE_INTERVAL = 150;

let eatSound = new Audio();
let levelUpSound = new Audio();
let deadSound = new Audio();
let hitWallSound = new Audio();
let doneSound = new Audio();

eatSound.src = "./assets/audio/eat.mp3";
levelUpSound.src = "./assets/audio/level-up.mp3";
deadSound.src = "./assets/audio/lose.mp3";
hitWallSound.src = "./assets/audio/hit-wall.mp3";
doneSound.src = "./assets/audio/win.mp3";

let level = 1;
let wallX = [];
let wallY = [];
let sum = 0;

let levelWall2 = [
    {
        x1: 4,
        x2: 15,
        y: 3,
    },
];

let levelWall3 = [
    {
        x1: 4,
        x2: 15,
        y: 7,
    },
];

let levelWall4 = [
    {
        x1: 4,
        x2: 15,
        y: 11,
    },
];

let levelWall5 = [
    {
        x1: 4,
        x2: 15,
        y: 15,
    },
];

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    };
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    };
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        move: MOVE_INTERVAL,
        health: [
            {
                x: sum,
                y: 0,
            },
            {
                x: sum + 20,
                y: 0,
            },
            {
                x: sum + 40,
                y: 0,
            },
        ],
    };
}

let snake1 = initSnake();

let apple1 = {
    position: initPosition(),
};

let apple2 = {
    position: initPosition(),
};

let lifes = {
    position: initPosition(),
};

function isPrimer(number) {
    let divider = 0;

    for (let i = 1; i <= number; i++) {
        if (number % i == 0) {
            divider++;
        }
    }
    return divider == 2 ? true : false;
}

function getStarted(msg) {
    alert(`You ${msg}`);
    snake1.score = 0;
    level = 1;
    wallX = [];
    wallY = [];
}

function initWall2() {
    for (let i = 0; i < levelWall2.length; i++) {
        for (let j = levelWall2[i].x1; j <= levelWall2[i].x2; j++) {
            wallX.push(j);
            wallY.push(levelWall2[i].y);
        }
    }
}

function initWall3() {
    for (let i = 0; i < levelWall3.length; i++) {
        for (let j = levelWall3[i].x1; j <= levelWall3[i].x2; j++) {
            wallX.push(j);
            wallY.push(levelWall3[i].y);
        }
    }
}

function initWall4() {
    for (let i = 0; i < levelWall4.length; i++) {
        for (let j = levelWall4[i].x1; j <= levelWall4[i].x2; j++) {
            wallX.push(j);
            wallY.push(levelWall4[i].y);
        }
    }
}

function initWall5() {
    for (let i = 0; i < levelWall5.length; i++) {
        for (let j = levelWall5[i].x1; j <= levelWall5[i].x2; j++) {
            wallX.push(j);
            wallY.push(levelWall5[i].y);
        }
    }
}

function createWall() {
    let wallCanvas = document.getElementById("snakeBoard");

    if (wallCanvas.getContext) {
        let wallCtx = wallCanvas.getContext("2d");

        for (let i = 0; i < wallX.length; i++) {
            drawCell(wallCtx, wallX[i], wallY[i], "#808080");
        }
    }
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas = document.getElementById("scoreBoard");

    if (scoreCanvas.getContext) {
        let scoreCtx = scoreCanvas.getContext("2d");

        scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        scoreCtx.font = "25px Arial";
        scoreCtx.fillStyle = "red";
        scoreCtx.fillText(
            "Score: " + snake.score,
            10,
            scoreCanvas.scrollHeight / 2
        );
    }
}

function drawSpeed(snake) {
    let speedCanvas = document.getElementById("speedBoard");

    if (speedCanvas.getContext) {
        let speedCtx = speedCanvas.getContext("2d");

        speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        speedCtx.font = "25px Arial";
        speedCtx.fillStyle = "#8A2BE2";
        speedCtx.fillText(
            "Speed: " + snake.move,
            10,
            speedCanvas.scrollHeight / 2
        );
    }
}

function drawLevel() {
    let levelCanvas = document.getElementById("levelBoard");

    if (levelCanvas.getContext) {
        let levelCtx = levelCanvas.getContext("2d");

        levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        levelCtx.font = "25px Arial";
        levelCtx.fillStyle = "blue";
        levelCtx.fillText("Level: " + level, 15, levelCanvas.scrollHeight / 2);
    }
}

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        let headImg = document.getElementById("head");

        ctx.drawImage(
            headImg,
            snake1.head.x * CELL_SIZE,
            snake1.head.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        for (let i = 1; i < snake1.body.length; i++) {
            let bodyImg = document.getElementById("body");
            ctx.drawImage(
                bodyImg,
                snake1.body[i].x * CELL_SIZE,
                snake1.body[i].y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }

        let img = document.getElementById("apple");
        ctx.drawImage(
            img,
            apple1.position.x * CELL_SIZE,
            apple1.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        ctx.drawImage(
            img,
            apple2.position.x * CELL_SIZE,
            apple2.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        let heartImg = document.getElementById("health");
        for (let i = 0; i < snake1.health.length; i++) {
            ctx.drawImage(
                heartImg,
                snake1.health[i].x,
                snake1.health[i].y,
                CELL_SIZE,
                CELL_SIZE
            );
        }

        if (isPrimer(snake1.score)) {
            let health = document.getElementById("health");
            ctx.drawImage(
                health,
                lifes.position.x * CELL_SIZE,
                lifes.position.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }

        createWall();
        drawScore(snake1);
        drawSpeed(snake1);
        drawLevel();
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    } else if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    } else if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    } else if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function messageAndAddSpeed(snakeScore, snakeMove) {
    levelUpSound.play();
    if (snakeScore % 5 == 0 && snakeScore != 0) {
        snakeMove.move -= 20;
        level++;
        alert(`Level up to: ${level}`);
    }
}

function checkScore(snakeScore, snake, snakeMove) {
    if (snakeScore == 5) {
        messageAndAddSpeed(snakeScore, snakeMove);
        initWall2();
    } else if (snakeScore == 10) {
        messageAndAddSpeed(snakeScore, snakeMove);
        initWall3();
    } else if (snakeScore == 15) {
        messageAndAddSpeed(snakeScore, snakeMove);
        initWall4();
    } else if (snakeScore == 20) {
        messageAndAddSpeed(snakeScore, snakeMove);
        initWall5();
    } else if (snakeScore == 25) {
        doneSound.play();
        getStarted("Win");
        snake1 = initSnake();
        stopped(snake1);
        location.reload();
    } else {
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
}

function eat(snake, apple1, apple2) {
    if (
        snake.head.x == apple1.position.x &&
        snake.head.y == apple1.position.y
    ) {
        apple1.position = initPosition();
        eatSound.play();
        snake.score++;
        checkScore(snake.score, snake, snake1);
    } else if (
        snake.head.x == apple2.position.x &&
        snake.head.y == apple2.position.y
    ) {
        apple2.position = initPosition();
        eatSound.play();
        snake.score++;
        checkScore(snake.score, snake, snake1);
    } else if (
        snake.head.x == lifes.position.x &&
        snake.head.y == lifes.position.y
    ) {
        lifes.position = initPosition();
        eatSound.play();
        snake.lifes++;

        for (let j = 0; j < snake.lifes; j++) {
            snake1.health.push({ x: sum + 60, y: 0 });
            sum += 20;
        }
    }
    snake.lifes = 0;
}

function stopped(snake) {
    snake.direction = DIRECTION.STOP;
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function checkCollision(snakes) {
    let isCollide = false;

    // check the snake hit its own body
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (
                    snakes[i].head.x == snakes[j].body[k].x &&
                    snakes[i].head.y == snakes[j].body[k].y
                ) {
                    snake1.health.length--;
                    sum -= 20;
                    if (snake1.health.length == 0) {
                        deadSound.play();
                        isCollide = true;
                    } else {
                        hitWallSound.play();
                    }
                }
            }
        }
    }

    // check the snake hit the wall
    for (let i = 0; i < wallX.length; i++) {
        if (
            snake1.head.x === wallX[i] &&
            (snake1.direction == 2 || snake1.direction == 3)
        ) {
            if (snake1.head.y === wallY[i] || snake1.head.y === wallY[i]) {
                snake1.health.length--;
                sum -= 20;
                if (snake1.health.length == 0) {
                    deadSound.play();
                    isCollide = true;
                } else {
                    hitWallSound.play();
                }
            }
        } else if (
            snake1.head.y === wallY[i] &&
            (snake1.direction == 0 || snake1.direction == 1)
        ) {
            if (snake1.head.x === wallX[i] || snake1.head.x === wallX[i]) {
                snake1.health.length--;
                sum -= 20;
                if (snake1.health.length == 0) {
                    deadSound.play();
                    isCollide = true;
                } else {
                    hitWallSound.play();
                }
            }
        }
    }

    // code for check apple and health so it doesn't appear in the obstacle
    for (let i = 0; i < wallX.length; i++) {
        if (apple1.position.x === wallX[i] || apple1.position.y === wallY[i]) {
            apple1.position = initPosition();
        } else if (
            apple2.position.y === wallY[i] ||
            apple2.position.x === wallX[i]
        ) {
            apple2.position = initPosition();
        } else if (
            lifes.position.y === wallY[i] ||
            lifes.position.x === wallX[i]
        ) {
            lifes.position = initPosition();
        }
    }

    if (isCollide) {
        deadSound.play();
        getStarted("Lose");
        snake1 = initSnake();
        stopped(snake1);
        location.reload();
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);

    !checkCollision([snake1])
        ? setTimeout(function () {
              move(snake);
          }, snake.move)
        : initGame();
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    };

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
});

function initGame() {
    move(snake1);
}

initGame();
