import Position from '../physics/position.js';
import Vector from '../physics/position.js';
import utils from '../gameUtils.js';
import { circle } from '../physics/shapes.js';

export class Object{
  constructor(position=new Position(10,10),shape={},style='black'){
    this.position = position;//position [x,y]
    this.shape = shape;//shape
    this.shape.position = this.position;
    this.style = style;//fillStyle
  }
  setStyle(style){this.style = style; return this;}
  setShape(shape){this.shape = shape; return this;}
  setPosition(position){this.position = position; return this;}
  Draw(context){
    this.shape.draw(context);
  }
}

export class physObj extends Object{
  constructor(position,shape,style,velocity=new Vector(0,0),type=0,mass=1,friction=.1,acceleration=1){
    super(position,shape,style);
    this.velocity = velocity;//velocity [vx, vy]
    this.type = type;//type for collisions(collisions are ignored for similar types)
    this.mass = mass;//mass
    this.friction = friction;//friction constant should be 0 to 1.
    this.acceleration = acceleration;
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
}

export class Projectile extends physObj{//projectiles handle collision with entities
  constructor(){
    super();
    this.damage = 1;
    this.timeout = 60;//number of ticks until deletion
  }
  setDamage(damage){this.damage = damage; return this;}
  setTimeout(timeout){this.timeout = timeout; return this;}
  checkTimeout(){return !this.timeout--;} 
}

export class Entity extends physObj{//entities are for things that aim in a certaian direction and have health
  constructor(){
    super();
    this.aim = new Vector(0,0);//aim [ax, ay]
    this.health = 10;
    this.gun = 0;//delay in ms between shots
    this.moveFunction
  }
  setAim(aim){this.aim.x = aim.x; this.aim.y = aim.y; return this;}
  setHP(health){this.health = health; return this;}
  setGun(gun){this.gun = gun; return this;}
  shootGun(){this.gun.Shoot({...this.position},this.aim.copy().scale(15)); return this;}
  conserveMomentum(source){
    let mtot = this.mass+source.mass;
    this.velocity.x = this.mass*this.velocity.x/mtot + source.velocity.x*source.mass/mtot;
    this.velocity.y = this.mass*this.velocity.y/mtot + source.velocity.y*source.mass/mtot;
    return this;
  }
  Tick(time,context){
    if(this.gun)
      this.gun.Tick();
    super.Tick();
    this.shape.style = utils.setStyleBasedOnType(this,this.type,time,context);
  }
  Draw(context){
    super.Draw(context);
    if(this.type==9999)
      utils.drawAimIndicator(this,context)
  }
  damage(source){this.health-=source.damage; return this;}
  checkHP(){return this.health < 1;}
}

export class gun{
  constructor(projArray=[]){
    this.projArray = projArray;
    this.type = 0;
    this.delay = 10;
    this.ticksToNextShot = 0;
    this.damage = 10;
    //this.shotSpeed = 10;
    this.shotSize = 10;
    this.shotMass = 5;
    this.shotFriction = 0;
    this.timeout = 180;
    this.shotSound = new Audio("../assets/snap.mp3");
    this.shotSound.volume = 0.05;
  }
  setType(type){this.type = type; return this;}
  canShoot(){return this.ticksToNextShot == 0;}
  Shoot(pos, velocity){
    if(this.canShoot()){
      if(this.shotSound!=undefined)
        this.shotSound.play();
      this.ticksToNextShot = this.delay;
      this.projArray.add(new Projectile).setType(this.type).setDamage(this.damage).setFriction(this.shotFriction).setMass(this.shotMass).setPosition(pos).setVelocity(velocity).setTimeout(this.timeout).setShape(new circle(this.shotSize,pos));
      //this.projArray.Display();
    }
  }
  Tick(){
    if(this.ticksToNextShot)
      this.ticksToNextShot--;
  }
}

