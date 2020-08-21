import physicsUtils from './physics/physicsUtils.js';
import drawUtils from './game/drawingUtils.js';
import Vector from './physics/vector.js';
import {circle} from './physics/shapes.js';
import position from './physics/position.js';
import inputHandler from './interface/inputHandler.js';
import {Entity, gun} from './physics/objects.js';
import {projectileArray, entityArray} from './game/objectArrays.js';
import Position from './physics/position.js';
import eventListeners from './interface/listeners.js';
import gameOver from './game/gameOver.js';

console.log('game.js');

let context = document.getElementById("gb").getContext("2d");
let uicontext = document.getElementById("ui-layer").getContext("2d");
let bgcontext = document.getElementById("background-layer").getContext("2d", { alpha: false });
let contextArray = [bgcontext,context,uicontext];//ordered from background to foreground
let numpads = 0;//number of connected gamepads
let eventListenerHandler = new eventListeners(contextArray,numpads);

let clientBox = eventListenerHandler.clientBox;

let time = Date.now();
let lasttime = time;
let framerate = 70;
let msDelay = 1000/framerate;
let projArray = new projectileArray(context);
let entArray = new entityArray(context);
let playerpos = new position(clientBox.width/2,clientBox.height/2);
let player = entArray.add(new Entity).setPosition(playerpos).setShape(new circle(40,playerpos)).setType(9999).setMass(10).setFriction(.05).setAim([0,0]).setHP(490);
player.hurtSound = new Audio("./assets/Oof.mp3");
let playergun = new gun(projArray);
playergun.setType(9999);// I set the player type to 9999. default is 0
player.setGun(playergun);
drawUtils.drawHPBar(player);

let iH = new inputHandler(player,"gb");

loop();

function loop(){
  time = Date.now();
  if(iH.gamePaused||time-lasttime<msDelay){//this locks the game to run at [framerate] so it doesn't run too fast on 144hz monitors
    if(eventListenerHandler.numberofConnectedGamepads)
      iH.checkPauseButton();
    window.requestAnimationFrame(loop);
    return;
  }
  lasttime = time;

  if(eventListenerHandler.numberofConnectedGamepads){
    iH.handleGamepadInput();
  }else{//mouse and keyboard
    iH.handleKeyboardAndMouseInput();
  }

  projArray.Tick(entArray);
  entArray.Tick(time);
  if(player.health<=0){
    gameOver(contextArray);
    return;
  }
  context.clearRect(0, 0, clientBox.width, clientBox.height);
  entArray.Draw(context);
  projArray.Draw(context);
  physicsUtils.screenWrap(player,clientBox.width,clientBox.height);
  if(entArray.array.length < 5){
    let enemy = entArray.add(new Entity).setType(0).setMass(30).setHP(100).setShape(new circle(30)).setPosition(new position(Math.random()*clientBox.width,Math.random()*clientBox.height));
    enemy.shape.position = enemy.position;
    enemy.damage = 50;
    while(Vector.differenceVector(player.position, enemy.position).magnitude<300){
      enemy.setPosition(new Position(Math.random()*clientBox.width,Math.random()*clientBox.height));
      enemy.shape.position = enemy.position;
      enemy.deathSound = new Audio("./assets/bleh.mp3");
    };
  }

  window.requestAnimationFrame(loop);
  
}