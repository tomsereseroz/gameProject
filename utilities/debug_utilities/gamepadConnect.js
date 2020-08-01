function gamepadConnect(event) {
    var gamepad = event.gamepad;
    console.log(gamepad);
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      event.gamepad.index, event.gamepad.id,
      event.gamepad.buttons.length, event.gamepad.axes.length);
    numpads++;
  }