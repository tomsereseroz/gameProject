export default class GameObjectArray {
  constructor() {
    this.array = [];
  }
  
  tick() { }

  draw() {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i].draw();
    }
  }

  add(object) {
    this.array[this.array.length] = object;
  }

  remove(index) {
    this.array.splice(index, 1);
  }

}