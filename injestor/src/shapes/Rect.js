import { getPosnWithBounds } from "../auxillary.js";

class Rect {
    constructor(top, left, width, height, color, borderColor) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    containsPoint(pX, pY) {
        return ((pX >= this.left) && (pX <= this.left + this.width)) &&
        ((pY >= this.top) && (pY <= this.top + this.height));
    }

    getXOffset(pX) {
        return pX - this.left;
    }

    getYOffset(pY) {
        return pY - this.top;
    }

    setLocation(x, y, optional={}) {
        this.left = getPosnWithBounds(x, optional.minX, optional.maxX);
        this.top = getPosnWithBounds(y, optional.minY, optional.maxY);
    }
}

export default Rect;
