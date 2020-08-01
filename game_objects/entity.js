class Entity extends Circle {//entities are for things that aim in a certaian direction and have health
    constructor(position, velocity, mass, friction, collisionType, style, radius, aim = Vector(0, 0), health = 10, shotDelay = 0) {
        super(position, velocity, mass, friction, collisionType, style, radius);
        this.aim = aim;
        this.health = health;
        this.shotDelay = shotDelay;//delay in ms between shots
    }

    shootGun() {
        scaledAim = Vector(this.aim.dx * 15, this.aim.dy * 15);

        this.gun.Shoot(this.position, scaledAim);
    }


    tick() {
        this.move();
        super.tick();
    }

    conserveMomentum(source) {
        let totalMass = this.mass + source.mass;

        mf1 = this.mass / totalMass;
        mf2 = source.mass / totalMass;

        this.velocity.dx = mf1 * this.velocity.dx + mf2 * source.velocity.dx;
        this.velocity.dy = mf1 * this.velocity.dy + mf2 * source.velocity.dy;
    }

    takeDamage(source) { this.health -= source.damage }

    healthIsDepleted() { return this.health < 1; }

    draw() {
        if (this.collisionType == CollisionType.player) {//player case, draw extra marker for aim 
            this.setStyle(utils.createPlayerGradient(this, context, time));
            super.Draw();
            utils.drawAimIndicator(this, context);
        } else if (this.collisionType == CollisionType.enemy) {
            this.setStyle(utils.getHPStyle(this, context));
            super.Draw();
        } else
            super.Draw();
    }


    move(player) {//sets velocity

        distance = Vector.fromPositions(this.position, player.position).magnitude;

        if (this.collisionType == 9999) {//player case

        } else if (this.collisionType == 0 && distance < 500) {//enemy case
            utils.aMoveAtB(this, player);
        }
    }

}