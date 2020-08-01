class Shape {

    constructor(position = Vector(0, 0), velocity = Vector(0, 0), mass = 1, friction = .1, collisionType = CollisionType.default, style = "black") {//maybe add acceleration to this later
        
        this.position = position;

        this.style = style;

        this.velocity = velocity;
        this.collisionType = collisionType;//type for collisions(collisions are ignored for similar types)
        this.mass = mass;
        this.friction = friction; //friction constant should be 0 to 1.
    }

    tick() {//updates position based on velocity and applies a damping to velocity
        this.position.addVector(velocity);
        this.velocity.scale(1 - this.friction)
    }

    static isCollisionCC(first, second) {
        distance = Vector(first.position, second.position).magnitude;

        return distance < (first.radius + second.radius);
    }

    static isCollisionRR(first, second) {
        return (first.left < second.right
            && first.right > second.left
            && first.top < second.bottom
            && first.bottom > second.top);
    }

    static isCollisionCR(first, second) {

        distanceVector = Vector(first.position, second.position);
        distanceVector.dx = Math.abs(distanceVector.dx);
        distanceVector.dy = Math.abs(distanceVector.dy);
        dx = clamp(0, second.props[0] / 2, dx);
        dy = clamp(0, second.props[1] / 2, dy);
        // return(
        //   this.toRadius(

        //     this.distance(first.pos, [cx+dx,cy+dy]  < first.props[0])

        //     )

        //   );
    }

}