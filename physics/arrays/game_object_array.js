class GameObjectArray{
    constructor(){
      this.array = [];
    }
    tick(){
      for (var i = 0; i < this.array.length; i++){
        this.array[i].tick();
      } 
    }

    draw(){
      for (var i = 0; i < this.array.length; i++){
        this.array[i].draw();
      }
    }

    add(object){
      this.array[this.array.length] = object;
    }

    remove(index){
      this.array.splice(index,1);
    }

    // Display(){
    //   console.log("displaying Array");
    //   for(let i = 0; i<this.array.length; i++){
    //     console.log(this.array[i]);
    //   }
    // }
  }