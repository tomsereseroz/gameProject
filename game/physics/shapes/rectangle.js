class Rectangle extends Shape {
    constructor(position, velocity, mass, friction, collisionType, style, height, width) {
        super(position, velocity, mass, friction, collisionType, style);
        this.height = height;
        this.width = width;
    }

    get left() { return position.x - width / 2 };
    get right() { return position.x + width / 2 };
    get top() { return position.y - height / 2 };
    get bottom() { return position.y + height / 2 };

    get isOffScreen() {
        return (this.right < 0
            || this.left > SCREENWIDTH
            || this.top < 0
            || this.top > SCREENHEIGHT);
    }

    draw() {
        if (!this.isOffScreen) {
            context.fillStyle = this.style;
            context.fillRect(0, 0, this.left, this.top);
        }

    }

    collidesWith(other) {
        if (other instanceof Circle) Shape.isCollisionCR(other)
        else if (other instanceof Rectangle) Shape.isCollisionRR(other)
        else;  // Should throw an error

    }

}