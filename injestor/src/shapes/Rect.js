import { getPosnWithBounds } from "../auxillary.js";
import { Shape, TO } from "./Shape.js";

class Rect extends Shape {
    constructor(top, left, width, height, color, borderColor) {
        super();
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
    }

    get connectors() {
        const halfWidth = this.width/2;
        const halfHeight = this.height/2;
        return {
            top: {x:this.left+halfWidth, y:this.top, accepts: [TO], provides: []},
            bottom: {x:this.left+halfWidth, y:this.top+this.height, accepts: [TO], provides: []},
            left: {x:this.left, y:this.top+halfHeight, accepts: [TO], provides: []},
            right: {x:this.left+this.width, y:this.top+halfHeight, accepts: [TO], provides: []}
        };
    }

    draw(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        if(this.shouldShadow) {
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 5;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.shadowBlur = 0;
        super.draw(ctx);
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
