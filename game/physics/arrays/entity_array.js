class EntityArray extends GameObjectArray{
    tick(){
      for (var i = 0; i < this.array.length; i++){
        for(var j = i+1; j < this.array.length; j++){
          if(this.array[i].collidesWith(this.array[j])){
            //console.log(this.array[i].type,this.array[j].type);
            if(this.array[i].collisionType == this.array[j].collisionType){
              utils.moveApart(this.array[i],this.array[j]);
            }
          }
        }
        this.array[i].tick();
      }
    }
  }