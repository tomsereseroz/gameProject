class Interface {
    constructor(window, document) {
        this.numpads = 0;
        window.addEventListener("gamepadconnected", function (e) { numpads++; });
        window.addEventListener("gamepaddisconnected", function () { numpads-- });

        this.mouseX = 0;
        this.mouseY = 0;
        document.onmousemove = function (e) {
            mouseX = e.clientX - canvasRect.x;
            mouseY = e.clientY - canvasRect.y;
        };
        
        
        document.onkeydown = keyDownHandler;
        document.onkeyup = keyUpHandler;
        
        document.onmousedown = function () { mousedown = 1; };
        document.onmouseup = function () { mousedown = 0; };
    }

    keyDownHandler(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keysdown[event.keyCode - 37] = 1;
        } else
            switch (event.keyCode) {
                case 65:
                    keysdown[0] = 1;
                    break;
                case 87:
                    keysdown[1] = 1;
                    break;
                case 68:
                    keysdown[2] = 1;
                    break;
                case 83:
                    keysdown[3] = 1;
                    break;
                default:
                    break;
            }
    }

    keyUpHandler(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keysdown[event.keyCode - 37] = 0;
        } else
            switch (event.keyCode) {
                case 65:
                    keysdown[0] = 0;
                    break;
                case 87:
                    keysdown[1] = 0;
                    break;
                case 68:
                    keysdown[2] = 0;
                    break;
                case 83:
                    keysdown[3] = 0;
                    break;
                default:
                    break;
            }
    }




}