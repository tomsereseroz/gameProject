import {Projectile} from '../../physics/objects.js';
import {circle} from '../../physics/shapes.js';


class basicGun{
  constructor(projArray=[]){
    this.projArray = projArray;
    this.delay = 8;
    this.ticksToNextShot = 0;
    this.damage = 10;
    this.shotSize = 10;
    this.shotMass = 10;
    this.shotSpeed = 30;
    this.shotFriction = 0;
    this.shotStyle = "black";
    this.timeout = 180;
    this.shotSound = new Audio("../assets/snap.mp3");
    this.shotSound.volume = 0.05;
  }
  canShoot(){return this.ticksToNextShot == 0;}
  Shoot(pos, aim){
    aim.scale(this.shotSpeed);
    if(this.canShoot()){
      if(this.shotSound!=undefined)
        this.shotSound.play();
      this.ticksToNextShot = this.delay;
      let shot = this.makeShot(pos,aim);
      this.projArray[this.projArray.length] = shot;
    }
  }
  Tick(){
    if(this.ticksToNextShot)
      this.ticksToNextShot--;
  }
  makeShot(pos,velocity){
    let shot = new Projectile;
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
  setVolume(volume){
    this.shotSound.volume = 0.05*volume;
  }
}

export class gun extends basicGun{
  constructor(projArray=[]){
    super(projArray);
  }
}

export class shotgun extends basicGun{
  constructor(projArray=[]){
    super(projArray);
    this.numShots = 10;
    this.shotSize = 8;
    this.damage = 8;
    this.delay = 50;
    this.shotSpread = 0.2;
    this.shotSound = new Audio("../assets/shotgunBlast.mp3");
    this.reloadSound = new Audio("../assets/shotgunCock.mp3");
    this.shotSound.volume = 0.5;
  }
  Shoot(pos, aim){
    if(this.canShoot()){
      if(this.shotSound!=undefined)
        this.shotSound.play();
      this.ticksToNextShot = this.delay;
      for(let i = 0; i< this.numShots; i++){
        let newVelocity = aim.copy();
        newVelocity.scale(this.shotSpeed);
        newVelocity.scale(Math.random()*0.1+0.95)
        newVelocity.shiftByRandomAngle(this.shotSpread);
        let shot = this.makeShot({... pos},newVelocity);
        this.projArray[this.projArray.length] = shot
      }
    }
  }
  Tick(){
    super.Tick();
    if(this.ticksToNextShot==22)
      this.reloadSound.play();
  }
  setVolume(volume){
    this.shotSound.volume = 0.5 * volume;
    this.reloadSound.volume = volume;
  }
}