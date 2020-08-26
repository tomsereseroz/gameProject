import Position from './position.js';
import Vector from './position.js';
import drawingUtils from '../game/drawingUtils.js';
import { circle } from './shapes.js';
import {gun} from '../game/guns.js';

export class Object{
  constructor(position=new Position(10,10),shape={},style='black'){
    this.position = position;//position [x,y]
    this.shape = shape;//shape
    this.shape.position = this.position;
    this.shape.style = style;//fillStyle
  }
  setStyle(style){this.shape.style = style; return this;}
  setShape(shape){this.shape = shape; return this;}
  setPosition(position){this.position = position; return this;}
  Draw(context){
    this.shape.draw(context);
  }
}

export class physObj extends Object{
  constructor(position,shape,style,velocity=new Vector(0,0),type=0,mass=1,friction=.1,acceleration=1,damage=0){
    super(position,shape,style);
    this.velocity = velocity;//velocity.x , .y
    this.type = type;//type for collisions(collisions are ignored for similar types)
    this.mass = mass;//mass
    this.friction = friction;//friction constant should be 0 to 1.
    this.acceleration = acceleration;
    this.damage = damage;
  }
  setVelocity(velocity){this.velocity.x = velocity.x; this.velocity.y = velocity.y; return this;}
  setType(type){this.type = type; return this;}
  setMass(mass){this.mass = mass; return this;}
  setFriction(friction){this.friction = friction; return this;}
  Tick(){//updates position based on velocity and applies a damping to velocity
    this.position.x = this.position.x + this.velocity.x;
    this.position.y = this.position.y + this.velocity.y;
    this.velocity.x *= 1 - this.friction;
    this.velocity.y *= 1 - this.friction;
  }
  collidesWith(other){//checks collision with another object. returns True if collided.
    return this.shape.collidesWith(other.shape);
  }
  Draw(context){
    if(this.shape.isOnScreen(context)) super.Draw(context);
  }
  absorbMomentum(other){//maybe wanna move these momentum functions into physics utils
    let totalMass = this.mass+other.mass;
    this.velocity.x = this.mass*this.velocity.x/totalMass + other.velocity.x*other.mass/totalMass;
    this.velocity.y = this.mass*this.velocity.y/totalMass + other.velocity.y*other.mass/totalMass;
    return this;
  }
  tradeMomentum(other){
    let momentum1 = this.velocity.copy().scale(this.mass);
    let momentum2 = other.velocity.copy().scale(other.mass);
    let finalVelocity1 = momentum2.scale(1/this.mass);
    let finalVelocity2 = momentum1.scale(1/other.mass);
    this.velocity = finalVelocity1;
    other.velocity = finalVelocity2;
    return this;
  }
}

export class Projectile extends physObj{//projectiles handle collision with entities
  constructor(){
    super();
    this.timeout = 60;//number of ticks until deletion
  }
  setDamage(damage){this.damage = damage; return this;}
  setTimeout(timeout){this.timeout = timeout; return this;}
  checkTimeout(){return !this.timeout--;}
}

export class Entity extends physObj{//entities are for things that aim in a certaian direction and have health
  constructor(){
    super();
    this.aim = new Vector(0,0);//aim.x, .y
    this.health = 10;
    this.gun = 0;
    this.moveFunction;
    this.hurtSound = new Audio("../assets/hit.mp3");
    this.hurtSound.volume = 0.5;
  }
  setAim(aim){this.aim.x = aim.x; this.aim.y = aim.y; return this;}
  setHP(health){this.health = health; return this;}
  setGun(gun){this.gun = gun; return this;}
  shootGun(){this.gun.Shoot({...this.position},this.aim.copy().scale(15)); return this;}
  Tick(time,context){
    if(this.gun)
      this.gun.Tick();
    super.Tick();
    this.shape.style = drawingUtils.setStyleBasedOnType(this,this.type,time,context);
  }
  Tick2(){
    if(this.gun)
      this.gun.Tick();
    super.Tick();
  }
  Draw(context){
    super.Draw(context);
  }
  applyDamage(source){this.health-=source.damage; this.hurtSound.play(); return this;}
  checkHP(){return this.health < 1;}
}

export class Player extends Entity{
  constructor(projArray,position){
    super();
    this.gun = new gun(projArray);
    this.gun.type = 9999;
    this.type = 9999;
    this.mass = 10;
    this.friction = 0.05;
    this.health = 490;
    this.position = position;
    this.shape = new circle(40,this.position);
    this.hurtSound = new Audio("./assets/Oof.mp3");
  }
  Tick(time,context){
    super.Tick2();
    let playergrd = this.generatePlayerGradient(time,context);
    this.shape.style = playergrd;
  }
  Draw(context){
    super.Draw(context);
    drawingUtils.drawAimIndicator(this,context);
  }
  generatePlayerGradient(time,context){
    let playergrd = context.createRadialGradient(this.position.x, this.position.y, 5, this.position.x, this.position.y,40);
    playergrd.addColorStop(0, "purple");
    playergrd.addColorStop(.4+.3*Math.sin(2*time*Math.PI/2000), "black");
    playergrd.addColorStop(.8+.1*Math.sin(2*time*Math.PI/3000), "red");
    playergrd.addColorStop(.95+.05*Math.sin(2*time*Math.PI/600), "pink");
    return playergrd;
  }
}