import { getPosnWithBounds } from "../auxillary.js";

class Rect {
    constructor(top, left, width, height, color, borderColor) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
        this.shouldShadow = false;
        this.borderColor = borderColor;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        if(this.shouldShadow) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = "black";
        }
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
        const { minX, maxX, minY, maxY } = optional;
        const leftMaxX = maxX === undefined ? maxX : maxX - this.width;
        const topMaxY = maxY === undefined ? maxY : maxY - this.height;
        this.left = getPosnWithBounds(x, minX, leftMaxX);
        this.top = getPosnWithBounds(y, minY, topMaxY);
    }
}

export default Rect;
