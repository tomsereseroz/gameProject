export default class Position {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }

  addVector(other) {
      this.x += other.dx;
      this.y += other.dy;
  }

}