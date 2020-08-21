import physicsUtils from '../physics/physicsUtils.js';
import drawingUtils from '../game/drawingUtils.js';
import Vector from '../physics/vector.js';

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

export class projectileArray extends objectArray{//checks all projectiles with entities
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
            entArray.array[j].hurtSound.play();
            if(entArray.array[j].checkHP()){
              this.deathSound.play();
              entArray.array.splice(j,1);
              j--
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
      if(this.array[i].type == 0){
        if(Vector.differenceVector(this.array[i].position,this.array[0].position).magnitude<500)
          physicsUtils.aMoveAtB(this.array[i],this.array[0])//move at player (index 0) for each normal enemy
      }
      this.array[i].Tick(time,this.context);
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
    object.hurtSound.play();
    if(object.type==9999)
      drawingUtils.drawHPBar(object);
}