import drawUtils from './game/drawingUtils.js';
import Vector from './physics/vector.js';
import position from './physics/position.js';
import inputHandler from './interface/inputHandler.js';
import Player from './game/gameObjects/player.js';
import {objectHandler} from './game/gameObjects/objectHandlers.js';
import Position from './physics/position.js';
import eventListeners from './interface/listeners.js';
import {basicShooter, basicMelee} from './game/gameObjects/enemies.js';
import hslWalker from './coolStuff/colorWalk.js';
import {initializeUI, showPauseMenu, hidePauseMenu} from './interface/userInterface.js';

console.log('game.js');

initializeUI();
showPauseMenu();

let context = document.getElementById("gb").getContext("2d");
let uicontext = document.getElementById("ui-layer").getContext("2d");
let bgcontext = document.getElementById("background-layer").getContext("2d", { alpha: false });
let contextArray = [bgcontext,context,uicontext];//ordered from background to foreground

let backGroundDrawer = new hslWalker(bgcontext);

let eventListenerHandler = new eventListeners(contextArray,backGroundDrawer);
let clientBox = eventListenerHandler.clientBox;//updates on window resize event

let time = Date.now();
let lasttime = time;

let framerate = 70;
let msDelay = 1000/framerate;

let oH = new objectHandler(contextArray,eventListenerHandler);

let playerpos = new position(clientBox.width/2,clientBox.height/2);
let player = new Player(oH.projectileHandler.playerArray,playerpos);

oH.addPlayer(player);

drawUtils.drawHPBar(player);

let iH = new inputHandler(player,"gb",oH);

iH.gamePaused = true;

loop();

function loop(){
  backGroundDrawer.draw(bgcontext);

  time = Date.now();
  
  if(iH.gamePaused||time-lasttime<msDelay){//this locks the game to run at [framerate] so it doesn't run too fast on 144hz+ monitors
    if(eventListenerHandler.numberofConnectedGamepads)
      iH.checkPauseButton();
    window.requestAnimationFrame(loop);
    return;
  }
  lasttime = time;

  if(eventListenerHandler.numberofConnectedGamepads){
    iH.handleGamepadInput();
  }else{
    iH.handleKeyboardAndMouseInput();
  }
  
  if(oH.tick(time)){ iH.kI.removeCallback("Escape"); return;} //oH calls gameOver

  if(oH.entityHandler.enemyArray.length < 4){
    let enemy;
    if(Math.random()<0.5){
      enemy = new basicMelee;
    }else{
      enemy = new basicShooter(oH.projectileHandler.enemyArray);
    }
    enemy.position = new position(Math.random()*clientBox.width,Math.random()*clientBox.height);
    enemy.shape.position = enemy.position;
    while(Vector.differenceVector(player.position, enemy.position).magnitude<300){
      enemy.position = new Position(Math.random()*clientBox.width,Math.random()*clientBox.height);
      enemy.shape.position = enemy.position;
    };
    oH.addEnemy(enemy);
  }

  window.requestAnimationFrame(loop);
  
}