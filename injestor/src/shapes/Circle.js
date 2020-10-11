class Circle {
    constructor(top, left, diameter, color) {
        this.top = top;
        this.left = left;
        this.diameter = diameter;
        this.color = color;
    }

    get radius() {
        return this.diameter/2
    }

    get center() {
        const x = this.left + this.radius;
        const y = this.top + this.radius;
        return { x, y }
    }

    draw(ctx) {
        const { x, y } = this.center;
        ctx.arc(x, y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    containsPoint(pX, pY) {
        const { x, y } = this.center;
        return (Math.pow(pX - x, 2) + Math.pow(pY - y, 2)) <= Math.pow(this.radius, 2);
    }
}

export default Circle;
