/*
I've created this class because I wanted to have my own api over the document object
JS can get very verbose when handling the dom and I don't want to use JQuery for this project.
*/
class DocumentHelpers {
    constructor(document) {
        this.document = document;
    }
    recursiveMerge(obj1, obj2) {
        const objA = {...obj1 };
        const objB = {...obj2 };
        Object.entries(objB).forEach(([key, value]) => {
            if (typeof value === "object" && typeof objA[key] === "object") {
                objA[key] = recursiveMerge(objA[key], value);
            } else {
                objA[key] = value;
            }
        })
        return objA;
    }
    getElementById(id) {
        return this.document.getElementById(id);
    }
    createElement(tag, props) {
        let node = this.document.createElement(tag);
        console.log(this.recursiveMerge(node, props));
        return this.recursiveMerge(node, props);
    }
}

/*
this is the screen where everything gets drawn, like a canvas
*/
class Board {
    constructor(snake, documentHelpers) {
        this.snake = snake;
        this.node = documentHelpers.getElementById("main");
    }

    update() {
        this.snake.update();
    }
    render() {
        this.node.innerHTML = "";
        this.node.append(...this.snake.renderBodyParts());
    }
}

/*
this is the snake class, where It's behaviour is defined 
for now it only moves but it cannot die eating itself nor touching the walls
also It cannot grow, I'll handle that once the fruit class is done
*/
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

    constructor(documentHelpers) {
        this.documentHelpers = documentHelpers;
    }

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
        return this.body.map(({ x, y }) =>
            this.documentHelpers.createElement("div", {
                classList: "snake",
                style: {
                    gridRowStart: y,
                    gridColumnStart: x,
                },
            })
        );
    }
}


/*
this "input handler" takes keyboard key configurations and the snake as arguments
then it can check with those keycodes which key is pressed and change the snake direction accordingly
*/
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
const FRAME_INTERVAL = 0.5;
const documentHelpers = new DocumentHelpers(document);
const snake = new Snake(documentHelpers);
const board = new Board(snake, documentHelpers);
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

/*
this loop runs at an unknown rate, that's why I "throttle" the board renders manually
checking the system clock for an interval in seconds to be present between the last render and the current one
*/
function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    const now = currentTimestamp();
    if ((now - previousTimestamp) / 1000 > FRAME_INTERVAL) {
        previousTimestamp = now;
        board.update();
        board.render();
    }
}

window.requestAnimationFrame(gameLoop);