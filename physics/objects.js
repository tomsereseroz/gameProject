import Position from './position.js';
import Vector from './vector.js';
import drawingUtils from '../game/drawingUtils.js';
import { circle } from './shapes.js';
import {gun, shotgun} from '../game/gameObjects/guns.js';

export class Object{
  constructor(position=new Position(10,10),shape={},style='black'){
    this.position = position;//position [x,y]
    this.shape = shape;//shape
    this.shape.position = this.position;
    this.shape.style = style;//fillStyle
  }
  Draw(context){
    this.shape.draw(context);
  }
}

export class physObj extends Object{
  constructor(position,shape,style,velocity=new Vector(0,0),mass=1,friction=.1,acceleration=1,damage=0){
    super(position,shape,style);
    this.velocity = velocity;//velocity.x , .y
    this.mass = mass;//mass
    this.friction = friction;//friction constant should be 0 to 1.
    this.acceleration = acceleration;
    this.damage = damage;
  }
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
  bounce(other){
    let differenceVector = Vector.differenceVector(this.position,other.position);
    differenceVector = differenceVector.unitVector;
    let massRatio = other.mass/this.mass;
    massRatio = Math.min(massRatio, 3);
    massRatio = Math.max(massRatio, 0.3)
    this.velocity.x -= differenceVector.x*10*massRatio;
    this.velocity.y -= differenceVector.y*10*massRatio;
    other.velocity.x += differenceVector.x*10/massRatio;
    other.velocity.y += differenceVector.y*10/massRatio;
  }
}

export class Projectile extends physObj{//projectiles handle collision with entities
  constructor(){
    super();
    this.timeout = 60;//number of ticks until deletion
  }
  checkTimeout(){return !this.timeout--;}
  isTimedOut(){return this.timeout <= 0;}
  tick(){
    this.timeout--;
    super.Tick();
  }
}

export class Entity extends physObj{//entities are for things that aim in a certaian direction and have health
  constructor(){
    super();
    this.aim = new Vector(0,0);//aim.x, .y
    this.health = 10;
    this.gun = undefined;
    this.hurtSound = new Audio("./assets/hit.mp3");
    this.hurtSound.volume = 0.5;
  }
  shootGun(){this.gun.Shoot({...this.position},this.aim.copy()); return this;}
  Tick(){
    if(this.gun)
      this.gun.Tick();
    super.Tick();
  }
  Draw(context){
    super.Draw(context);
  }
  applyDamage(source){this.health-=source.damage; this.hurtSound.play(); return this;}
  checkHP(){return this.health < 1;}
  noHP(){return this.health < 1;}
  stayInBounds(context){
    if(this.position.x < 50)
      this.velocity.x += 50-this.position.x;
    if(this.position.x > context.canvas.width - 50)
      this.velocity.x -= this.position.x - context.canvas.width + 50;
    if(this.position.y < 50)
      this.velocity.y += 50-this.position.y;
    if(this.position.y > context.canvas.height - 50)
      this.velocity.y -= this.position.y - context.canvas.height + 50;
  }
  setVolume(volume){
    this.hurtSound.volume = 0.5 * volume;
  }
}