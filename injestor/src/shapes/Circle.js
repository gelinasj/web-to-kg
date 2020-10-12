class Circle {
    constructor(top, left, diameter, color, borderColor) {
        this.top = top;
        this.left = left;
        this.diameter = diameter;
        this.color = color;
        this.borderColor = borderColor;
    }

    get radius() {
        return this.diameter/2;
    }

    get center() {
        const x = this.left + this.radius;
        const y = this.top + this.radius;
        return { x, y };
    }

    draw(ctx) {
        const { x, y } = this.center;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    containsPoint(pX, pY) {
        const { x, y } = this.center;
        return (Math.pow(pX - x, 2) + Math.pow(pY - y, 2)) <= Math.pow(this.radius, 2);
    }

    getXOffset(pX) {
        return pX - this.left;
    }

    getYOffset(pY) {
        return pY - this.top;
    }

    setLocation(x, y) {
        this.left = x;
        this.top = y;
    }
}

export default Circle;
