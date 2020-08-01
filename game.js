import d2 from './2DUtils.js';
import utils from './gameUtils.js';

console.log('game.js');




function drawButton(button, index) {
  context.fillStyle = "black";
  if (button.value) { context.fillStyle = "white"; }
  var xval = Math.floor(index / 5) * 100 + 20;
  var yval = (index * 100 + 20) % height;
  context.fillRect(xval, yval, 60, 60);

}

function checkButton(button, index) {
  if (button.value) {
    switch (index) {
      case 7: player.shootGun();//7 = trigger
      default:
    }
  }
}

function loop() {
  d = new Date;
  time = d.getTime();

  height = document.documentElement.clientHeight - 200;
  width = document.documentElement.clientWidth - 20;
  if (lastHeight != height || lastWidth != width)
    grd = utils.createBGgradient(context, width);
  lastHeight = height;
  lastWidth = width;
  context.canvas.height = height;
  context.canvas.width = width;
  context.fillStyle = grd;//"linear-gradient(to bottom right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
  context.fillRect(0, 0, width, height);

  if (numpads) {//gamepad control section
    const gamepads = navigator.getGamepads();
    axes = gamepads[0].axes.slice();
    buttons = gamepads[0].buttons.slice();
    //buttons.forEach(drawButton);
    for (let i = 0; i < 4; i++)
      if (Math.abs(axes[i]) < 0.04)
        axes[i] = 0;//adds a deadzone to the controller
    player.velocity.x += axes[0];
    player.velocity.y += axes[1];
    player.aim.x = axes[2];
    player.aim.y = axes[3];

    buttons.forEach(checkButton);

  } else {//mouse and keyboard
    //move
    if (keysdown != [0, 0, 0, 0]) {
      player.velocity.x += keysdown[2] - keysdown[0];
      player.velocity.y += keysdown[3] - keysdown[1];
    }
    //aim
    utils.aimAtCoords(player, [mouseX, mouseY]);
    if (mousedown) {
      player.shootGun();
    }
  }
  entArray.draw();
  projArray.draw();
  projArray.tick();
  entArray.tick();

  utils.screenWrap(player, width, height);
  if (entArray.array.length < 15) {
    let enemy = entArray.add(new Entity).setType(0).setProperties([70]).setMass(30).setHP(100).setShape(shapes.Circle).setPosition([Math.random() * width, Math.random() * height]);
    while (d2.toRadius(d2.distance(player.pos, enemy.pos)) < 300) {
      enemy.setPosition([Math.random() * width, Math.random() * height]);
    };
  }


  context.drawImage(heartImg, 10, 10);
  context.drawImage(heartImg, 55, 10);
  context.drawImage(emptyheartImg, 100, 10);
  window.requestAnimationFrame(loop);
}

//start of runtime code

let context = document.getElementById("gb").getContext("2d");

let height = document.documentElement.clientHeight - 200;
let lastHeight = height;
let width = document.documentElement.clientWidth - 20;
let lastWidth = width;
let grd = utils.createBGgradient(context, width);

let canvasRect = document.getElementById("gb").getBoundingClientRect();


let cutoff = 0.04;
let keysdown = [0, 0, 0, 0];
let mousedown = 0;

let d = new Date;
let time = d.getTime();

let axes = [];
let buttons = {};

let projArray = new projectileArray;
let entArray = new entityArray;

let player = entArray.add(Entity(
  Position(3 * width / 4, 3 * height / 4),
  null,
  1000,
  .05,
  CollisionType.player,
  40,
  null,
  60
));

let playergrd = utils.createPlayerGradient(player, context, time);
let heartImg = document.getElementById("heart");
let emptyheartImg = document.getElementById("emptyheart");

let playergun = new gun;
playergun.setType(9999);
player.setGun(playergun);

loop();