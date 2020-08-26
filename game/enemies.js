import { Entity } from '../physics/objects.js';
import {gun} from './guns.js';
import phUtils from '../physics/physicsUtils.js';
import { circle } from '../physics/shapes.js';
import Vector from '../physics/vector.js';

export class basicShooter extends Entity{
  constructor(projectileArray){
    super();
    this.health = 35;
    this.mass = 5;
    this.gun = new gun(projectileArray);
    this.gun.delay = 30;
    this.gun.shotStyle = "red";
    this.shape = new circle(30);
    this.deathSound = new Audio("./assets/bleh.mp3");
  }
  Tick(player,context){
    super.Tick2();
    if(this.shape.isOnScreen(context)){
      this.shape.style = this.setStyle(context);
      phUtils.aimAtCoords2(this,player.position);
      if(Vector.differenceVector(this.position,player.position).magnitude<1000)//shoot at player
        this.gun.Shoot({...this.position},this.aim.copy().scale(15));
    }
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "brown");
    grd.addColorStop(this.health/101, "red");
    grd.addColorStop(1, "black");
    return grd;
  }
}

export class basicMelee extends Entity{
  constructor(){
    super();
    this.mass = 30;
    this.health = 100;
    this.shape = new circle(30);
    this.damage = 50;
    this.deathSound = new Audio("./assets/bleh.mp3");
  }
  Tick(player,context){
    super.Tick2();
    if(this.shape.isOnScreen(context)){
      this.shape.style = this.setStyle(context);
      phUtils.aimAtCoords2(this,player.position);
      if(Vector.differenceVector(this.position,player.position).magnitude<500){//move at player
        this.velocity.x += this.aim.x;
        this.velocity.y += this.aim.y;
      }
    }
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "white");
    grd.addColorStop(this.health/101, "red");
    grd.addColorStop(1, "black");
    return grd;
  }
}