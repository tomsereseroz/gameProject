import position from './position.js'

export default class Vector extends position{
  constructor(x, y) {
      super(x,y);
  }

  static differenceVector(obj1, obj2) {
      let x = obj2.x - obj1.x;
      let y = obj2.y - obj1.y;
      return new Vector(x, y);
  }

  get magnitude() {
      return Math.hypot(this.x,this.y);
  }

  get unitVector() {
      let m = this.magnitude;
      return new Vector(this.x / m, this.y / m);
  }

  copy(){//returns new instance of vector with the same properties
      return new Vector(this.x, this.y);
  }
}