import Position from './position.js';

export default class Interface {
    constructor() {
        // Listens for the connection of gamepads (i.e. controllers and keyboards)
        this.gamepadCount = 0;
        window.addEventListener("gamepadconnected", function (e) { this.gamepadCount++; });
        window.addEventListener("gamepaddisconnected", function () { this.gamepadCount-- });

        // Listens for changes in mouse position
        this.mousePosition = Position(0, 0);
        document.onmousemove = function (e) {
            this.mousePosition.x = e.clientX - canvasRect.x;
            this.mousePosition.y = e.clientY - canvasRect.y;
        };

        // Listens for key events
        document.onkeydown = keyDownHandler;
        document.onkeyup = keyUpHandler;

        // Listens for mouse events
        this.mousedown = false;
        document.onmousedown = function () { this.mousedown = 1; };
        document.onmouseup = function () { this.mousedown = 0; };

        this.context = document.getElementById("gb").getContext("2d");

        let height = document.documentElement.clientHeight - 200;
        this.lastHeight = height;
        let width = document.documentElement.clientWidth - 20;
        this.lastWidth = width;

        this.background = utils.createBackground();

        this.canvasRect = document.getElementById("gb").getBoundingClientRect();

        this.cutoff = 0.04;
        this.keysDown = [0, 0, 0, 0];

        let d = new Date;
        this.time = d.getTime();

        this.axes = [];
        this.buttons = {};

        init();
    }

    init() { }

    createBackground() { }

    keyDownHandler(event) { }

    keyUpHandler(event) { }

    handleGamepadEvents(axes, buttons) { }

    handleKeyEvents(keysDown) { }

    handleMouseEvents() { }

    drawFrame() { }

    runGame() {
        d = new Date;
        time = d.getTime();

        this.height = document.documentElement.clientHeight - 200;
        this.width = document.documentElement.clientWidth - 20;
        if (this.lastHeight != this.height || this.lastWidth != this.width)
            this.background = this.createBackground();
        this.lastHeight = this.height;
        this.lastWidth = this.width;
        this.context.canvas.height = this.height;
        this.context.canvas.width = this.width;
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.width, this.height);

        if (this.gamepadCount > 0) {
            const gamepads = navigator.getGamepads();
            axes = gamepads[0].axes.slice();
            buttons = gamepads[0].buttons.slice();

            for (let i = 0; i < 4; i++)
                if (Math.abs(axes[i]) < 0.04)
                    axes[i] = 0; // adds a deadzone to the controller

            this.handleGamepadEvents(axes, buttons);

        } else {//mouse and keyboard
            //move
            if (this.keysDown != [0, 0, 0, 0]) {
                this.handleKeysDown(this.keysDown)
            }

            this.handleMouseEvents();
        }

        drawFrame();

        window.requestAnimationFrame(this.runGame());
    }


}