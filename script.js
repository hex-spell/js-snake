class Board {
    node = document.getElementById("main");

    constructor(snake) {
        this.snake = snake;
    }

    update() {
        this.snake.update();
    }
    render() {
        this.node.innerHTML = "";
        this.node.append(...this.snake.renderBodyParts());
    }
}

class Snake {
    body = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
        { x: 10, y: 13 },
        { x: 10, y: 14 },
        { x: 10, y: 15 },
    ];
    head = this.body[0];
    direction = { x: 0, y: 0 };

    setDirection(x, y) {
        this.direction = { x, y };
    }
    getDirection() {
        return this.direction;
    }
    update() {
        if ((this.direction.x !== 0) ^ (this.direction.y !== 0)) {
            // TODO: analize this part
            for (let i = this.body.length - 2; i >= 0; i--) {
                this.body[i + 1] = {...this.body[i] };
            }
            this.body[0].x += this.direction.x;
            this.body[0].y += this.direction.y;
        }
    }
    renderBodyParts() {
        return this.body.map(({ x, y }) => {
            const snakePart = document.createElement("div");
            snakePart.classList = "snake";
            snakePart.style.gridRowStart = y;
            snakePart.style.gridColumnStart = x;
            return snakePart;
        });
    }
}

class InputHandler {
    constructor(window, { up, left, right, down }, snake) {
        this.keys = { up, left, right, down };
        this.snake = snake;
        this.window = window;
    }

    init() {
        this.eventListener = this.window.addEventListener("keydown", (event) => {
            const { x, y } = this.snake.getDirection();
            switch (event.key) {
                case this.keys.up:
                    if (y === 0) this.snake.setDirection(0, -1);
                    break;
                case this.keys.down:
                    if (y === 0) this.snake.setDirection(0, 1);
                    break;
                case this.keys.left:
                    if (x === 0) this.snake.setDirection(-1, 0);
                    break;
                case this.keys.right:
                    if (x === 0) this.snake.setDirection(1, 0);
                    break;
            }
        });
    }
    stop() {
        this.window.removeEventListener("keydown", this.eventListener);
    }
}

const currentTimestamp = () => new Date().getTime();
let previousTimestamp = currentTimestamp();
const FRAME_DELAY = 0.5;
const snake = new Snake();
const board = new Board(snake);
const inputHandler = new InputHandler(
    window, {
        up: "ArrowUp",
        left: "ArrowLeft",
        right: "ArrowRight",
        down: "ArrowDown",
    },
    snake
);
inputHandler.init();

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    const now = currentTimestamp();
    if ((now - previousTimestamp) / 1000 > FRAME_DELAY) {
        previousTimestamp = now;
        board.update();
        board.render();
    }
}

window.requestAnimationFrame(gameLoop);