import physicsUtils from '../../physics/physicsUtils.js';
import drawingUtils from '../drawingUtils.js';
import Vector from '../../physics/vector.js';
import Player from './player.js';
import {basicShooter, basicMelee} from './enemies.js';
import gameOver from '../gameOver.js';

export class objectHandler{
  constructor(contextArray,eventListenerHandler){
    this.globalVolume = 1;
    this.elh = eventListenerHandler;
    this.contextArray = contextArray;
    this.projectileHandler = new projectileHandler();
    this.entityHandler = new entityHandler();
  }
  tick(time){
    if( this.projectileHandler.tick(this.entityHandler,this.contextArray[1]) || 
        this.entityHandler.tick(time,this.contextArray[1])){
      gameOver(this.contextArray,this.globalVolume);
      return true;
    }
    this.contextArray[1].clearRect(0, 0, this.elh.clientBox.width, this.elh.clientBox.height);
    this.draw();
    return false;
  }
  addPlayer(player){
    player.setVolume(this.globalVolume);
    let playerArray = this.entityHandler.playerArray;
    playerArray[playerArray.length] = player;
  }
  addEnemy(enemy){
    enemy.setVolume(this.globalVolume);
    let enemyArray = this.entityHandler.enemyArray;
    enemyArray[enemyArray.length] = enemy;
  }
  addPlayerProjectile(projectile){
    let playerArray = this.projectileHandler.playerArray;
    playerArray[playerArray.length] = projectile;
  }
  addEnemyProjectile(projectile){
    let enemyArray = this.projectileHandler.enemyArray;
    enemyArray[enemyArray.length] = projectile;
  }
  draw(){
    this.drawArray(this.entityHandler.playerArray);
    this.drawArray(this.entityHandler.enemyArray);
    this.drawArray(this.projectileHandler.playerArray);
    this.drawArray(this.projectileHandler.enemyArray);
  }
  drawArray(array){
    for(let i = 0; i < array.length; i++) array[i].Draw(this.contextArray[1]);
  }
  setVolume(volume){
    this.globalVolume = volume;
    this.projectileHandler.globalVolume = volume;
    let arrays = [this.entityHandler.playerArray,
                  this.entityHandler.enemyArray,
                  this.projectileHandler.playerArray,
                  this.projectileHandler.enemyArray];
    arrays.forEach((array)=>{
      for(let i = 0; i < array.length; i++) 
        if(array[i].setVolume)
          array[i].setVolume(volume);
    })
  }
}

class projectileHandler{
  constructor(){
    this.globalVolume = 1;
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
              deathSound.volume = this.globalVolume;
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
        projectileArray.splice(i,1);
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