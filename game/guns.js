
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
      this.projArray.add(new Projectile).setType(this.type).setDamage(this.damage).setFriction(this.shotFriction).setMass(this.shotMass).setPosition(pos).setVelocity(velocity).setTimeout(this.timeout).setShape(new circle(this.shotSize,pos).setStyle(this.shotStyle));
    }
  }
  Tick(){
    if(this.ticksToNextShot)
      this.ticksToNextShot--;
  }
}

