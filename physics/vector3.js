export default class Vector3{
  constructor(one,two,three){
    this.x = one;
    this.y = two;
    this.z = three;
  }

  get magnitude(){return Math.hypot(this.x,this.y,this.z); }

  copy(){//returns new instance of vector with the same properties
    return new Vector3(this.x, this.y, this.z);
  }

  add(other){
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }
}