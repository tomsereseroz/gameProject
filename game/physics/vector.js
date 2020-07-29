class Vector {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    static fromPositions(pos1, pos2) {
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;

        return Vector(dx, dy);
    }

    get magnitude() {
        return Math.sqrt(dx * dx + dy * dy);
    }

    get unitVector() {
        let m = magnitude;
        return Vector(dx / m, dy / m);
    }

    scale(factor) {
        dx *= factor;
        dy *= factor;
    }

}