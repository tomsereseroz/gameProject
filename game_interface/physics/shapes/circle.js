import Shape from './physics/shape.js';

export default class Circle extends Shape {

    constructor({position, velocity, mass, friction, collisionType, style, radius = 10}) {
        super({position, velocity, mass, friction, collisionType, style});
        this.radius = radius;
    }

    get isOffScreen(interface) {
        return (this.right < 0
            || this.left > interface.width
            || this.bottom < 0
            || this.top > interface.height);

    }

    get left() { return position.x - this.radius };
    get right() { return position.x + this.radius };
    get top() { return position.y - this.radius };
    get bottom() { return position.y + this.radius };

    draw(interface) {
        if (!this.isOffScreen) {
            interface.context.beginPath();
            interface.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            interface.context.fillStyle = this.style;
            interface.context.fill();
        }
    }

    collidesWith(other) {
        if (other instanceof Circle) Shape.isColisionCC(other)
        else if (other instanceof Rectangle) Shape.isCollisionCR(other)
        else; // Should throw an error

    }

}