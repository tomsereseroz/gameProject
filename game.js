import d2 from './2DUtils.js';
import utils from './gameUtils.js';
import Vector from './physics/vector.js';
import position from './physics/position.js'

console.log('game.js');

let numpads = 0;

function gamepadConnect(event) {
  var gamepad = event.gamepad;
  console.log(gamepad);
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      event.gamepad.index, event.gamepad.id,
      event.gamepad.buttons.length, event.gamepad.axes.length);      
  numpads++;
}

window.addEventListener("gamepadconnected", function(e) { gamepadConnect(e); });
window.addEventListener("gamepaddisconnected", function() { numpads-- });
document.getElementById("pauseMenu").children[0].addEventListener("click", () => {gamePaused = 0;} );
document.onkeydown = keyDownHandler;
document.onkeyup = keyUpHandler;
document.onmousemove = function(e){
mouseX = e.clientX - canvasRect.x;
mouseY = e.clientY - canvasRect.y;
};
document.onmousedown = function() { mousedown = 1; };
document.onmouseup =   function() { mousedown = 0; };

function keyDownHandler(event){
  if(event.keyCode >= 37 && event.keyCode <= 40){//< ^ > v arrow keys
    keysdown[event.keyCode-37] = 1;
  }else
    switch(event.keyCode){
      case 27://esc key
        if(!gamePaused){
        gamePaused = 1;
        document.getElementById("pauseMenu").style = "display: flex;"//this displays the pause menu that's hidden by default
        }else{
        gamePaused = 0;
        document.getElementById("pauseMenu").style = "display: none;"//this displays the pause menu that's hidden by default
        }
        break;
      case 65://a
        keysdown[0] = 1;
        break;
      case 87://w
        keysdown[1] = 1;
        break;
      case 68://d
        keysdown[2] = 1;
        break;
      case 83://s
        keysdown[3] = 1;
        break;
      default:
        break;
    }
}

function keyUpHandler(event){
  if(event.keyCode >= 37 && event.keyCode <= 40){
    keysdown[event.keyCode-37] = 0;
  }else
    switch(event.keyCode){
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

const shapes = {
  Undefined: 0,
  Circle: 1,
  Rectangle: 2
  //rotated rectangle? arc?
}

class Object{
  constructor(){
    this.pos = new position(0,0);//position [x,y]
    this.shape = shapes.Circle;//enumerated shape
    this.props = [];//array of shape properties (width, radius, etc).
    this.style = "black";//fillStyle
  }
  setStyle(style){this.style = style; return this;}
  setShape(shape){this.shape = shape; return this;}
  setPosition([x,y]){this.pos.x = x; this.pos.y = y; return this;}
  setProperties(props){this.props = props; return this;}
  Draw(){
    switch(this.shape){
      case shapes.Circle:
        context.beginPath();
        context.arc(this.pos[0],this.pos[1],this.props[0],0,2*Math.PI);
        context.fillStyle = this.style;
        context.fill();
        break;
      case shapes.Rectangle:
        context.fillStyle = this.style;
        context.fillRect(0,0,this.props[0],this.props[1]);
        break;
      default:
    }
  }
}

class physObj extends Object{
  constructor(){//maybe add acceleration to this later
    super();//calls Object()
    this.vel = new Vector(0,0);//velocity [vx, vy]
    this.type = 0;//type for collisions(collisions are ignored for similar types)
    this.mass = 1;//mass
    this.friction = .1;//friction constant should be 0 to 1.
  }
  setVelocity(vel){this.vel.x = vel[0]; this.vel.y = vel[1]; return this;}
  setType(type){this.type = type; return this;}
  setMass(mass){this.mass = mass; return this;}
  setFriction(friction){this.friction = friction; return this;}
  Tick(){//updates position based on velocity and applies a damping to velocity
    this.pos[0] = this.pos[0] + this.vel[0];
    this.pos[1] = this.pos[1] + this.vel[1];
    this.vel[0] *= 1 - this.friction;
    this.vel[1] *= 1 - this.friction;
  }
  collidesWith(other){//checks collision with another object. returns 1 if collided.
    switch(this.shape){
      case shapes.Circle:
        switch(other.shape){
          case shapes.Circle:
            return d2.isCCCollision(this,other);
          case shapes.Rectangle:
            return d2.isCRCollision(this,other);
          default:
            console.log("checkcollision called on object without proper shape")
        }
      case shapes.Rectangle:
        switch(other.shape){
          case shapes.Circle:
            return d2.isCRCollision(other,this);
          case shapes.Rectangle:
            return d2.isRRCollision(this,other);
          default:
            console.log("checkcollision called on object without proper shape")
        }
    }
  }
  isOffScreen(){
    switch(this.shape){
      case shapes.Circle:
        return this.pos[0]+this.props[0] < 0 || this.pos[0]-this.props[0] > width || this.pos[1]+this.props[0] < 0 || this.pos[1]-this.props[0] > height;
      case shapes.Rectangle:
        return this.pos[0]+this.props[0] < 0 || this.pos[0] > width || this.pos[1] + this.props[1] < 0 || this.pos[1] > height;
    }
  }
  Draw(){
    if(!this.isOffScreen()) super.Draw();
  }
}

class Projectile extends physObj{//projectiles handle collision with entities
  constructor(){
    super();
    this.damage = 1;
    this.startTime = time;
    this.timeout = 60;
  }
  setDamage(damage){this.damage = damage; return this;}
  setTimeout(timeout){this.timeout = timeout; return this;}
  checkTimeout(){return !this.timeout--;} 
}

class Entity extends physObj{//entities are for things that aim in a certaian direction and have health
  constructor(){
    super();
    this.aim = new Vector(0,0);//aim [ax, ay]
    this.health = 10;
    this.gun = 0;//delay in ms between shots
  }
  setAim(aim){this.aim.dx = aim[0]; this.aim.dy = aim[1]; return this;}
  setHP(health){this.health = health; return this;}
  setGun(gun){this.gun = gun; return this;}
  shootGun(vel){this.gun.Shoot(this.pos,vel); return this;}
  Tick(){
    this.Move();
    super.Tick();
  }
  conserveMomentum(source){
    let mtot = this.mass+source.mass;
    this.vel.x = this.mass*this.vel.x/mtot + source.vel.x*source.mass/mtot;
    this.vel.y = this.mass*this.vel.y/mtot + source.vel.y*source.mass/mtot;
    return this;
  }
  damage(source){this.health-=source.damage; return this;}
  checkHP(){return this.health < 1;}
  Draw(){
    if(this.type == 9999){//player case, draw extra marker for aim 
      this.setStyle(utils.createPlayerGradient(this,context,time));
      super.Draw();
      utils.drawAimIndicator(this,context);
    }else if(this.type == 0){
      this.setStyle(utils.getHPStyle(this,context));
      super.Draw();
    }else
    super.Draw();
  }
  Move(){//sets velocity
    if(this.type == 9999){//player case
      
    }else if(this.type == 0 && d2.toRadius(d2.distance(this.pos,player.pos)) < 500 ){//enemy case
      utils.aMoveAtB(this,player);
    }
  }
}

class gun{
  constructor(){
    this.type = 0;
    this.delay = 1;
    this.lastShotTime = time;
    this.damage = 10;
    this.shotSpeed = 100;
    this.shotSize = 10;
    this.shotMass = 5;
    this.shotFriction = 0;
    this.timeout = 180;
  }
  setType(type){this.type = type; return this;}
  canShoot(){return time - this.lastShotTime > this.delay;}
  Shoot(pos, vel){
    if(this.canShoot()){
      this.lastShotTime = time;
      projArray.add(new Projectile).setType(this.type).setDamage(this.damage).setFriction(this.shotFriction).setMass(this.shotMass).setPosition(pos).setVelocity(vel).setTimeout(this.timeout).setShape(shapes.Circle).setProperties([this.shotSize]);
      //projArray.Display();
    }
  }
}

class objectArray{
  constructor(){
    this.array = [];
  }
  Tick(){
    for (var i = 0; i < this.array.length; i++){
      this.array[i].Tick();
    } 
  }
  Draw(){
    for (var i = 0; i < this.array.length; i++){
      this.array[i].Draw();
    }
  }
  add(object){
    this.array[this.array.length] = object;
    return object;
  }
  remove(index){
    this.array.splice(index,1);
    return this;
  }
  Display(){
    console.log("displaying Array");
    for(let i = 0; i<this.array.length; i++){
      console.log(this.array[i]);
    }
  }
}

class projectileArray extends objectArray{
  Tick(){
    var deleted = false;
    for (var i = 0; i < this.array.length; i++){
      deleted = false;
      if(this.array[i].checkTimeout()||this.array[i].isOffScreen()){
        deleted = true;
      }else{
        for(var j = 0; j < entArray.array.length; j++){
          if(this.array[i].collidesWith(entArray.array[j])&&this.array[i].type!=entArray.array[j].type){
            entArray.array[j].damage(this.array[i]).conserveMomentum(this.array[i]);
            if(entArray.array[j].checkHP()){
              entArray.array.splice(j,1);
              j--
            }
            deleted = true;
            break;
          }
        }
      }
      if(deleted){
        this.array.splice(i,1);
        i--;
      }else this.array[i].Tick();
    }
  }
  Draw(){
    for (var i = 0; i < this.array.length; i++){
      this.array[i].Draw();
    }
  }
}

class entityArray extends objectArray{
  Tick(){
    for (var i = 0; i < this.array.length; i++){
      for(var j = i+1; j < this.array.length; j++){
        if(this.array[i].collidesWith(this.array[j])){
          //console.log(this.array[i].type,this.array[j].type);
          if(this.array[i].type == this.array[j].type){
            utils.moveApart(this.array[i],this.array[j]);
          }
        }
      }
      this.array[i].Tick();
    }
  }
}

function drawButton(button, index){//this is to see where a button maps with a certain gamepad/. use buttons.forEach(drawButton)
  context.fillStyle = "black";
  if(button.value){context.fillStyle = "white";}
  var xval = Math.floor(index/5)*100+20;
  var yval = (index*100+20)%height;
  context.fillRect(xval,yval,60,60);
  
}

function checkButton(button,index){
  if(button.value){
    switch(index){
      case 7: player.shootGun(player.aim.map(x => x*15));//7 = trigger
      default:
    }
  }
}

function loop(){
  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;
  if(lastheight!= height || lastwidth != width){//not optimal
    grd = utils.createBGgradient(context,width);
    context.canvas.height = height;
    context.canvas.width = width;
  }
  lastheight = height;
  lastwidth = width;

  time = Date.now();
  if(gamePaused||time-lasttime<framerate){//this resets the loop if the game is paused or if the loop is run at more than 70fps
    window.requestAnimationFrame(loop);
    return;
  }
  
  
  if(numpads){//gamepad control section
    const gamepads = navigator.getGamepads();
    axes = gamepads[0].axes.slice();//axes is a readonly variable, so slice() diplicates the array
    buttons = gamepads[0].buttons;
    //buttons.forEach(drawButton);
    for(let i = 0; i<4; i++)
      if(Math.abs(axes[i]) < cutoff)
        axes[i] = 0;//adds a deadzone to the controller
    player.vel[0] += axes[0];
    player.vel[1] += axes[1];
    player.aim[0] = axes[2];
    player.aim[1] = axes[3];

    buttons.forEach(checkButton);

  }else{//mouse and keyboard
    //move
    if(keysdown != [0,0,0,0]){
      player.vel.x += keysdown[2] - keysdown[0];
      player.vel.y += keysdown[3] - keysdown[1];
    }
    //aim
    let mousePos = new position(mouseX,mouseY);
    utils.aimAtCoords(player,mousePos);
    if(mousedown){
      player.shootGun(player.aim.map(x => x*15));
    }
  }

  context.fillStyle = grd;//"linear-gradient(to bottom right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
  context.fillRect(0,0,width,height);
  lasttime = time;
  entArray.Draw();
  projArray.Draw();
  projArray.Tick();
  entArray.Tick();

  utils.screenWrap(player,width,height);
  if(entArray.array.length < 15){
    let enemy = entArray.add(new Entity).setType(0).setProperties([70]).setMass(30).setHP(100).setShape(shapes.Circle).setPosition([Math.random()*width,Math.random()*height]);
    while(d2.toRadius(d2.distance(player.pos, enemy.pos))<300){
      enemy.setPosition([Math.random()*width,Math.random()*height]);
    };
  }
  context.drawImage(heartImg, 10, 10);
  context.drawImage(heartImg, 55, 10);
  context.drawImage(emptyheartImg, 100, 10); 
  window.requestAnimationFrame(loop);
  
}

//start of runtime code

let context = document.getElementById("gb").getContext("2d", { alpha: false });
//context types are "2d", "webgl", "webgl2", and "bitmaprenderer" 
//"2d" makes context an instance of "CanvasRenderingContext2D" which is a part of the canvas API

let height = document.documentElement.clientHeight;
let lastheight = height;
let width = document.documentElement.clientWidth;
let lastwidth = width;
//I'm using lastheight and lastwidth to check if the window is resized but there is a window.onresize event that should be used
context.canvas.height = height;
context.canvas.width = width;

let grd = utils.createBGgradient(context,width);//background gradient
let canvasRect = document.getElementById("gb").getBoundingClientRect();
//the canvas should fill the page now so I don't think this is needed any longer

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
let projArray = new projectileArray;
let entArray = new entityArray;
let player = entArray.add(new Entity).setPosition([width/2,height/2]).setShape(shapes.Circle).setType(9999).setMass(1000).setFriction(.05).setProperties([40]).setAim([0,0]).setHP(60);
let heartImg = document.getElementById("heart");
let emptyheartImg = document.getElementById("emptyheart");
let playergun = new gun;
playergun.setType(9999);// I set the player type to 9999. default is 0
//projectiles marked 9999 are assumed to originate from the player and only hurt enemies
player.setGun(playergun);
var gamePaused = 0;
loop();