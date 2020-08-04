export default class Vector {
  constructor(dx, dy) {
      this.dx = dx;
      this.dy = dy;
  }

  static fromPositions(pos1, pos2) {
      let dx = pos2.x - pos1.x;
      let dy = pos2.y - pos1.y;

      return new Vector(dx, dy);
  }

  get magnitude() {//math.hypot
      return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  get unitVector() {
      let m = this.magnitude;
      return new Vector(this.dx / m, this.dy / m);
  }

  scale(factor) {
      this.dx *= factor;
      this.dy *= factor;
      return this;
  }

}