import utils from './gameUtils.js';
import Vector from './physics/vector.js';
import {circle, rectangle} from './physics/shapes.js';
import position from './physics/position.js';
import inputHandler from './inputHandler.js';
import {Object, physObj, Projectile, Entity, gun} from './game/objects.js';
import {projectileArray, entityArray} from './game/objectArrays.js';
import Position from './physics/position.js';

console.log('game.js');

let numpads = 0;

window.addEventListener("gamepadconnected", function() { console.log("connected"); numpads++ });
window.addEventListener("gamepaddisconnected", function() { numpads-- });
window.addEventListener("resize",() =>{
  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;
  grd = utils.createBGgradient(bgcontext,width);
  bgcontext.canvas.height = height;
  bgcontext.canvas.width = width;
  context.canvas.height = height;
  context.canvas.width = width;
  bgcontext.fillStyle = grd;//"linear-gradient(to right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
  bgcontext.fillRect(0,0,width,height);
});
document.getElementById("pauseMenu").children[0].addEventListener("click", () => {iH.gamePaused = 0;} );
document.getElementById("pauseMenu").children[1].addEventListener("click", () => {location.reload();} );

function loop(){
  time = Date.now();
  if(iH.gamePaused||time-lasttime<framerate){//this resets the loop if the game is paused or if the loop is run at more than 70fps
    window.requestAnimationFrame(loop);
    return;
  }
  
  //control section
  if(numpads){//gamepad 
    iH.handleGamepadInput();
  }else{//mouse and keyboard
    iH.handleKeyboardAndMouseInput();
  }

  context.clearRect(0, 0, width, height);
  lasttime = time;

  projArray.Tick(entArray);
  entArray.Tick(time);
  entArray.Draw(context);
  projArray.Draw(context);
  
  
  

  utils.screenWrap(player,width,height);
  if(entArray.array.length < 5){
    let enemy = entArray.add(new Entity).setType(0).setMass(30).setHP(100).setShape(new circle(70)).setPosition(new position(Math.random()*width,Math.random()*height));
    enemy.shape.position = enemy.position;
    while(Vector.differenceVector(player.position, enemy.position).magnitude<300){
      enemy.setPosition(new Position(Math.random()*width,Math.random()*height));
      enemy.shape.position = enemy.position;
    };
  }
  context.drawImage(heartImg, 10, 10);
  context.drawImage(heartImg, 55, 10);
  context.drawImage(emptyheartImg, 100, 10); 
  window.requestAnimationFrame(loop);
  
}

//start of runtime code

let context = document.getElementById("gb").getContext("2d");
let bgcontext = document.getElementById("background-layer").getContext("2d", { alpha: false });
//context types are "2d", "webgl", "webgl2", and "bitmaprenderer" 
//"2d" makes context an instance of "CanvasRenderingContext2D" which is a part of the canvas API

let height = document.documentElement.clientHeight;
let width = document.documentElement.clientWidth;
//I'm using lastheight and lastwidth to check if the window is resized but there is a window.onresize event that should be used
context.canvas.height = height;
context.canvas.width = width;
bgcontext.canvas.height = height;
bgcontext.canvas.width = width;
let grd = utils.createBGgradient(bgcontext,width);//background gradient
let canvasRect = document.getElementById("gb").getBoundingClientRect();
//the canvas should fill the page now so I don't think this is needed any longer
bgcontext.fillStyle = grd;//"linear-gradient(to bottom right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
bgcontext.fillRect(0,0,width,height);

let mouseX = 0;
let mouseY = 0;
let cutoff = 0.05;
//controller deadzone cutoff.

let keysdown = [0,0,0,0];//for < ^ > v movement, in that order
let mousedown = 0;
let time = Date.now();
let lasttime = time;
let framerate = 1000/70;
let axes = [];
let buttons = {};
let projArray = new projectileArray(context);
let entArray = new entityArray(context);
let playerpos = new position(width/2,height/2);
let player = entArray.add(new Entity).setPosition(playerpos).setShape(new circle(40,playerpos)).setType(9999).setMass(1000).setFriction(.05).setAim([0,0]).setHP(60);
let heartImg = document.getElementById("heart");
let emptyheartImg = document.getElementById("emptyheart");
let playergun = new gun(projArray);
playergun.setType(9999);// I set the player type to 9999. default is 0
//projectiles marked 9999 are assumed to originate from the player and only hurt enemies
player.setGun(playergun);


let iH = new inputHandler(player,"gb");
var gamePaused = 0;
loop();
