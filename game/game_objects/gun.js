export default class Gun {
    constructor({projectileArry, shotDelay, time, damage, shotSpeed, shotSize, shotMass, shotFriction, collisionType, timeoutDuration}) {
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

    shoot(position, velocity) {
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