export default class Position {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
  add(other){
      this.x += other.x;
      this.y += other.y;
      return this;
  }

  scale(factor){
    this.x *= factor;
    this.y *= factor;
    return this;
  }
}