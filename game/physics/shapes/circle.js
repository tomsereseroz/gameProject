class Circle extends Shape {

    constructor(position, velocity, mass, friction, collisionType, style, radius) {
        super(position, velocity, mass, friction, collisionType, style);
        this.radius = radius;
    }

    get isOffScreen() {
        return (this.right < 0
            || this.left > SCREENWIDTH
            || this.bottom < 0
            || this.top > SCREENHEIGHT);

    }

    get left() { return position.x - this.radius };
    get right() { return position.x + this.radius };
    get top() { return position.y - this.radius };
    get bottom() { return position.y + this.radius };

    draw() {
        if (!this.isOffScreen) {
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            context.fillStyle = this.style;
            context.fill();
        }
    }

    collidesWith(other) {
        if (other instanceof Circle) Shape.isColisionCC(other)
        else if (other instanceof Rectangle) Shape.isCollisionCR(other)
        else; // Should throw an error

    }

}