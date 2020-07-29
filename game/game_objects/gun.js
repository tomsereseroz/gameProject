class gun {
    constructor(projectileArry, shotDelay = 100, damage = 10, shotSpeed = 100, shotSize = 10, shotMass = 5, shotFriction = 0, collisionType = CollisionType.default, timeoutDuration = 3000) {
        this.projectileArry = projectileArry;

        this.shotDelay = shotDelay;
        this.lastShotTime = time;
        this.damage = damage;
        this.shotSpeed = shotSpeed;
        this.shotSize = shotSize;
        this.shotMass = shotMass;
        this.shotFriction = shotFriction;
        this.collisionType = collisionType;
        this.timeoutDuration = timeoutDuration;
    }

    get timeSinceLastShot() { return time - this.lastShotTime; }

    get canShoot() { return this.timeSinceLastShot > this.delay }

    Shoot(position, velocity) {
        if (this.canShoot) {
            this.lastShotTime = time;

            newProjectile = Projectile(position,
                velocity,
                this.shotMass,
                this.shotFriction,
                this.damage,
                this.collisionType,
                this.timeoutDuration
            )

            projArray.add(newProjectile);
        }
    }

}