class Projectile extends Circle {//projectiles handle collision with entities
  constructor(position, velocity, mass, friction, damage = 1, collisionType, timeoutDuration = 1000) {
    super(position, velocity, mass, friction, collisionType, style, radius);
    this.damage = damage;
    this.startTime = time;
    this.timeoutDuration = timeoutDuration;
  }

  get timeout() { return startTime + timeoutDuration; }

  get hasTimedOut() {
    return this.timeout < time;
  }

}