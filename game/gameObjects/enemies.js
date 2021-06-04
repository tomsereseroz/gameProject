import { Entity } from '../../physics/objects.js';
import {gun} from './guns.js';
import phUtils from '../../physics/physicsUtils.js';
import { circle } from '../../physics/shapes.js';
import Vector from '../../physics/vector.js';

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
    this.deathPath = "./assets/bleh.mp3";
    this.aggroRange = 900;
    this.moveTiming = 70;
    this.moveAngle = 0.2;
    this.moveSpeed = 0.5;
    this.velocity = new Vector(1,1);
  }
  Tick(player,context){
    super.Tick();
    if(this.shape.isOnScreen(context))
      this.shape.style = this.setStyle(context); 

    phUtils.aimAtCoords2(this,player.position);

    let differenceVector = Vector.differenceVector(this.position,player.position);
    if(differenceVector.magnitude<this.aggroRange)
      this.gun.Shoot({...this.position},this.aim.copy());
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
    if(!this.moveTiming--){//make new moveset
      this.moveTiming = Math.round(Math.random()*140+70);
      this.moveAngle = Math.random()*0.1-0.05;
      this.moveSpeed = Math.random()*3+3;
    }
    this.velocity.shiftByAngle(this.moveAngle);
    if(this.velocity.magnitude<this.moveSpeed)
      this.velocity.scale(1.2);
  }
  applyDamage(source){
    this.health-=source.damage; 
    this.hurtSound.play();
    this.aggroRange = 2000;
    return this;
  }
  setVolume(volume){
    if(this.gun.setVolume)
      this.gun.setVolume(volume);
    super.setVolume(volume);
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
    this.deathPath = "./assets/bleh.mp3"
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
  applyDamage(source){
    this.health-=source.damage; 
    this.hurtSound.play();
    this.aggroRange = 2000;
    return this;
  }
}

export class bigMelee extends Entity{
  constructor(objectHandler){
    super();
    this.oH = objectHandler;
    this.mass = 100;
    this.maxHealth = 300;
    this.health = 300;
    this.shape = new circle(60);
    this.damage = 80;
    this.deathPath = "./assets/bleh.mp3"
    this.ticksToMove = 80 + Math.floor(Math.random()*20);
    this.friction = 0.01;
  }
  Tick(player,context){
    super.Tick();
    if(this.shape.isOnScreen(context))
      this.shape.style = this.setStyle(context);

    phUtils.aimAtCoords2(this,player.position);
    if(this.ticksToMove==0){
      this.velocity.x += this.aim.x*20;
      this.velocity.y += this.aim.y*20;
      this.ticksToMove = 30 + Math.floor(Math.random()*30);
    }else
      this.ticksToMove--;
    this.stayInBounds(context);
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "green");
    grd.addColorStop(this.health/(this.maxHealth+1), "purple");
    grd.addColorStop(1, "black");
    return grd;
  }
  applyDamage(source){
    super.applyDamage(source);
    if(this.health<=0){
      for(let i=0;i<6;i++){
        let enemy = new miniMelee;
        enemy.position = this.position.copy();
        enemy.position.x += Math.random()*25-12.5;
        enemy.position.y += Math.random()*25-12.5;
        enemy.shape.position = enemy.position;
        this.oH.addEnemy(enemy);
      }
    }
  return this;
  }  
}

class miniMelee extends Entity{
  constructor(){
    super();
    this.mass = 5;
    this.maxHealth = 20;
    this.health = 20;
    this.shape = new circle(20);
    this.damage = 5;
    this.deathPath = "./assets/bleh.mp3"
    this.ticksToMove = Math.floor(Math.random()*50);
    this.friction = 0.1;
  }
  Tick(player,context){
    super.Tick();
    if(this.shape.isOnScreen(context))
      this.shape.style = this.setStyle(context);

    phUtils.aimAtCoords2(this,player.position);
    if(this.ticksToMove==0){
      this.velocity.x += this.aim.x*20;
      this.velocity.y += this.aim.y*20;
      let newTicksToMove = Math.floor(Math.random()*35);
      this.ticksToMove = 15+newTicksToMove;
    }else
      this.ticksToMove--;
    this.stayInBounds(context);
  }
  setStyle(context){
    let grd = context.createRadialGradient(this.position.x, this.position.y, 2,this.position.x,this.position.y,this.shape.radius);
    grd.addColorStop(0, "green");
    grd.addColorStop(this.health/(this.maxHealth+1), "purple");
    grd.addColorStop(1, "black");
    return grd;
  }
}