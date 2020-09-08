import { Entity } from '../physics/objects.js';
import {gun} from './guns.js';
import phUtils from '../physics/physicsUtils.js';
import { circle } from '../physics/shapes.js';
import Vector from '../physics/vector.js';

export class basicShooter extends Entity{
  constructor(projectileArray){
    super();
    this.maxHealth = 35;
    this.health = 35;
    this.mass = 5;
    this.gun = new gun(projectileArray);
    this.gun.delay = 30;
    this.gun.shotStyle = "red";
    this.shape = new circle(25);
    this.deathSound = new Audio("./assets/bleh.mp3");
    this.aggroRange = 900;
    this.moveTiming = 70;
    this.moveAngle = 0.2;
    this.moveSpeed = 0.5;
  }
  Tick(player,context){
    super.Tick();
    if(this.shape.isOnScreen(context))
      this.shape.style = this.setStyle(context); 

    phUtils.aimAtCoords2(this,player.position);

    let differenceVector = Vector.differenceVector(this.position,player.position);
    if(differenceVector.magnitude<this.aggroRange)
      this.gun.Shoot({...this.position},this.aim.copy().scale(15));
    this.moveRandomly();  
    this.avoidObject(differenceVector);
    this.stayInBounds(context);
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "brown");
    grd.addColorStop(this.health/(this.maxHealth+1), "red");
    grd.addColorStop(1, "black");
    return grd;
  }
  avoidObject(differenceVector){
    if(differenceVector.magnitude<400){
      let unitDifference = differenceVector.unitVector;
      this.velocity.x -= unitDifference.x*400/differenceVector.magnitude;
      this.velocity.y -= unitDifference.y*400/differenceVector.magnitude;
    }
  }
  moveRandomly(){
    if(!this.moveTiming){//make new moveset
      this.moveTiming = Math.round(Math.random()*140+70);
      this.moveAngle = Math.random()*0.3-0.15;
      this.moveSpeed = Math.random()*3+4;
    }
    let velocityMagnitude = this.moveSpeed;//velocity.magnitude;
    if(velocityMagnitude == undefined)
      velocityMagnitude = 1;
    // if(velocityMagnitude<this.moveSpeed)
    //   velocityMagnitude+=1;
    let velocityAngle = Math.atan2(this.velocity.y,this.velocity.x);
    velocityAngle += this.moveAngle;
    this.velocity.x = velocityMagnitude*Math.cos(velocityAngle);
    this.velocity.y = velocityMagnitude*Math.sin(velocityAngle);
    this.moveTiming--;
  }
}

export class basicMelee extends Entity{
  constructor(){
    super();
    this.mass = 30;
    this.maxHealth = 100;
    this.health = 100;
    this.shape = new circle(30);
    this.damage = 50;
    this.deathSound = new Audio("./assets/bleh.mp3");
    this.aggroRange = 500;
  }
  Tick(player,context){
    super.Tick();
    if(this.shape.isOnScreen(context))
      this.shape.style = this.setStyle(context);

    phUtils.aimAtCoords2(this,player.position);
    if(Vector.differenceVector(this.position,player.position).magnitude<this.aggroRange){
      this.velocity.x += this.aim.x;
      this.velocity.y += this.aim.y;
    }
    this.stayInBounds(context);
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "white");
    grd.addColorStop(this.health/(this.maxHealth+1), "red");
    grd.addColorStop(1, "black");
    return grd;
  }
}