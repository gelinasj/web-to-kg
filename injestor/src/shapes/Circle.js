import { getPosnWithBounds } from "../auxillary.js";
import Shape from "./Shape.js";

class Circle extends Shape {
    constructor(top, left, diameter, color, borderColor) {
        super();
        this.top = top;
        this.left = left;
        this.diameter = diameter;
        this.color = color;
        this.borderColor = borderColor;
        this.shouldShadow = false;
    }

    get radius() {
        return this.diameter/2;
    }

    get center() {
        const x = this.left + this.radius;
        const y = this.top + this.radius;
        return { x, y };
    }

    get connectors() {
        return [
            [this.left+this.radius, this.top],
            [this.left+this.radius, this.top+this.diameter],
            [this.left, this.top+this.radius],
            [this.left+this.diameter, this.top+this.radius]
        ];
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
        super.draw(ctx);
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

    setLocation(x, y, optional={}) {
        const { minX, maxX, minY, maxY } = optional;
        const leftMaxX = maxX === undefined ? maxX : maxX - this.diameter;
        const topMaxY = maxY === undefined ? maxY : maxY - this.diameter;
        this.left = getPosnWithBounds(x, minX, leftMaxX);
        this.top = getPosnWithBounds(y, minY, topMaxY);
    }
}

export default Circle;
