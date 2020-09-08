
import {Projectile} from '../physics/objects.js';
import {circle} from '../physics/shapes.js';

export class gun{
  constructor(projArray=[]){
    this.projArray = projArray;
    this.type = 0;
    this.delay = 8;
    this.ticksToNextShot = 0;
    this.damage = 10;
    this.shotSize = 10;
    this.shotMass = 10;
    this.shotFriction = 0;
    this.shotStyle = "black";
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
      let shot = this.makeShot(pos,velocity);
      this.projArray.add(shot);
    }
  }
  Tick(){
    if(this.ticksToNextShot)
      this.ticksToNextShot--;
  }
  makeShot(pos,velocity){
    let shot = new Projectile;
    shot.type = this.type;
    shot.damage = this.damage;
    shot.friction = this.shotFriction;
    shot.mass = this.shotMass;
    shot.position = pos;
    shot.velocity = velocity;
    shot.timeout = this.timeout;
    shot.shape = new circle(this.shotSize,pos);
    shot.shape.style = this.shotStyle;
    return shot;
  }
}

