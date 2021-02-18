import { getPosnWithBounds } from "../auxillary/auxillary.js";
import { Shape } from "./Shape.js";

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

    clone() {
      let clone = new Rect(this.top, this.left, this.width, this.height, this.color, this.borderColor);
      super.clone(clone);
      return clone;
    }

    get connectors() {
        const halfWidth = this.width/2;
        const halfHeight = this.height/2;
        return {
            top: {x:this.left+halfWidth, y:this.top},
            bottom: {x:this.left+halfWidth, y:this.top+this.height},
            left: {x:this.left, y:this.top+halfHeight},
            right: {x:this.left+this.width, y:this.top+halfHeight}
        };
    }

    draw(ctx, text) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        super.handleShadow(ctx);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.shadowColor = 0;
        ctx.shadowBlur = 0;
        if(text) {
          text = text.split(" ");
          ctx.font = "14px Arial";
          ctx.fillStyle = "black";
          const delta = 14;
          text.forEach((word, i) => ctx.fillText(word, this.left + this.width/2, this.top + this.height/2 + i*delta));
        }

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
