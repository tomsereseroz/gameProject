import physicsUtils from '../physics/physicsUtils.js';
import drawingUtils from '../game/drawingUtils.js';
import Vector from '../physics/vector.js';
import {basicShooter, basicMelee} from '../game/enemies.js';
import gameOver from './gameOver.js';

export class objectHandler{
  constructor(contextArray){
    this.contextArray = contextArray;
    this.context = contextArray[1];//uses game layer as main context
    this.projectileHandler = new projectileHandler();
    this.entityHandler = new entityHandler();
  }
  tick(time){
    if( this.projectileHandler.tick(this.entityHandler,this.context) || 
        this.entityHandler.tick(time,this.context)){
      gameOver(this.contextArray);
      return true;
    }
    return false;
  }
  addEntity(type,entity){
    this.add(this.entityHandler,type,entity);
  }
  addProjectile(type,projectile){
    this.add(this.projectileHandler,type,projectile);
  }
  add(handler,type,object){
    let array;
    switch(type){
      case "enemy":
        array = handler.enemyArray;
        break;
      case "player":
        array = handler.playerArray;
        break;
      default:
        console.log("invalid type given");
        break;
    }
    array[array.length] = object;
  }
}

class projectileHandler{
  constructor(){
    this.playerArray = [];
    this.enemyArray = [];
    //maybe add more arrays for multiple players in the future
  }
  tick(entityHandler,context){
    this.loopThroughProjectiles(this.playerArray,entityHandler.enemyArray,context);
    return this.loopThroughProjectiles(this.enemyArray,entityHandler.playerArray,context);
  }
  loopThroughProjectiles(projectileArray,entityArray,context){//returns 1 if game over
    var deleted = false;
    for(var i = 0; i < projectileArray.length; i++){
      let projectile = projectileArray[i];
      deleted = false;
      if(projectile.isTimedOut()||!projectile.shape.isOnScreen(context)){
        deleted = true;
      }else{
        for(var j = 0; j<entityArray.length; j++){
          let entity = entityArray[j];
          if(projectile.collidesWith(entity)){
            entity.applyDamage(projectile).absorbMomentum(projectile);
            if(entity.noHP()){
              if(entity instanceof Player) return true;
              let deathSound = new Audio(entity.deathPath);
              deathSound.play();
              addToScore(entity.maxHealth);
              entityArray.splice(j,1);
            }
            deleted = true;
            break;
          }
        }
      }
      if(deleted){
        this.array.splice(i,1);
        i--;
      }else projectile.tick();
    }
    return false;
  }
}

class entityHandler{
  constructor(){
    this.playerArray = [];
    this.enemyArray = [];
  }
  tick(time,context){
    for(var i = 0; i < this.enemyArray.length; i++){
      let ent1 = this.enemyArray[i];
      for(var j = i+1; j < this.enemyArray.length; j++){
        let ent2 = this.enemyArray[j];
        if(ent1.collidesWith(ent2)) physicsUtils.moveApart(ent1,ent2);
      }
      for(var j = 0; j < this.playerArray.length; j++){
        let player = this.playerArray[j];
        if(ent1.collidesWith(player)) handleEntityCollision(ent1, player);
        if(player.noHP()) return true;
      }
      ent1.Tick(this.playerArray[0],context);
    }
    for(var i = 0; i < this.playerArray.length; i++ )
      this.playerArray[i].Tick(time,context);
    return false;
  }
}

export class objectArray{
  constructor(context){
    this.array = [];
    this.context = context;
    this.deathSound = new Audio("../assets/bleh.mp3")
  }
  Tick(){
    for (var i = 0; i < this.array.length; i++){
      this.array[i].Tick();
    } 
  }
  Draw(){
    for (var i = 0; i < this.array.length; i++){
      this.array[i].Draw(this.context);
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

export class projectileArray extends objectArray{//checks all projectiles with all entities
  Tick(entArray){
    var deleted = false;
    for (var i = 0; i < this.array.length; i++){
      deleted = false;
      if(this.array[i].checkTimeout()||!this.array[i].shape.isOnScreen(this.context)){
        deleted = true;
      }else{
        for(var j = 0; j < entArray.array.length; j++){
          if(this.array[i].type!=entArray.array[j].type&&this.array[i].collidesWith(entArray.array[j])){
            entArray.array[j].applyDamage(this.array[i]).absorbMomentum(this.array[i]);
            if(entArray.array[j].type == 9999) drawingUtils.drawHPBar(entArray.array[j]);
            if(entArray.array[j].type!=9999){
              entArray.array[j].aggroRange = 2000;
              if(entArray.array[j].checkHP()){
                let deathSound = new Audio(entArray.array[j].deathPath);
                deathSound.play();
                addToScore(entArray.array[j].maxHealth);
                entArray.array.splice(j,1);
                j--
                
              }
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
}

export class entityArray extends objectArray{
  Tick(time){
    for (var i = 0; i < this.array.length; i++){
      for(var j = i+1; j < this.array.length; j++){
        if(this.array[i].collidesWith(this.array[j])){
          physicsUtils.moveApart(this.array[i],this.array[j]);
          if(this.array[i].type != this.array[j].type)
            handleEntityCollision(this.array[i],this.array[j]);
        }
      }
      if(this.array[i] instanceof basicShooter|| this.array[i] instanceof basicMelee) this.array[i].Tick(this.array[0],this.context);
      else this.array[i].Tick(time,this.context);
    }
  }
}

function handleEntityCollision(object1,object2){
  object1.tradeMomentum(object2);
  if(object1.damage)
    damageObject(object1,object2);
  if(object2.damage)
    damageObject(object2,object1);
}

function damageObject(damager,object){
    object.applyDamage(damager);
    if(object.type==9999)
      drawingUtils.drawHPBar(object);
}

function addToScore(number){
  let score = parseInt(document.getElementById("scorenum").textContent);
  score += number;
  document.getElementById("scorenum").textContent = String(score);
}