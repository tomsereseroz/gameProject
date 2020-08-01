import Circle from './physics/position.js';
import Vector from './physics/vector.js';
import Entity from './game_objects/entity.js';
import CollisionType from './physics/enums/collisionType.js';

export default class Entity extends Circle {//entities are for things that aim in a certaian direction and have health
    constructor({position, velocity, mass, friction, collisionType, style, radius, aim = Vector(0, 0), health = 10, gun}) {
        super({position, velocity, mass, friction, collisionType, style, radius});
        this.aim = aim;
        this.health = health;
        this.gun = gun;//delay in ms between shots
    }

    shootGun() {
        scaledAim = Vector(this.aim.dx * 15, this.aim.dy * 15);

        this.gun.shoot(this.position, scaledAim);
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

    aimAtCoords(position) {
        let v = Vector(this.position, position);
        factor = Math.min(v.magnitude / 500, 1);
        aim = v.unitVector;
        aim.scale(factor);
        this.aim = aim;
    }

    move(player) {//sets velocity

        distance = this.position.distanceTo(player.position);

        if (this.collisionType == CollisionType.player) {

        } else if (this.collisionType == CollisionType.enemy && distance < 500) {


            let v = Vector(this.position, player.position);
            let look = v.unitVector;
            this.velocity.addVector(look);
        }
    }

    // aMoveAtB(player) {
    //     let v = Vector(this.position, player.position);
    //     let look = v.unitVector;
    //     this.velocity.addVector(look);
    // }

    draw(interface) {
        if (this.collisionType == CollisionType.player) {//player case, draw extra marker for aim 
            this.style = utils.createPlayerGradient(this, context, time);
            super.draw();
            interface.drawAimIndicator(this);
        } else if (this.collisionType == CollisionType.enemy) {
            this.style = interface.getHPStyle(this);
            super.draw();
        } else
            super.draw();
    }

}