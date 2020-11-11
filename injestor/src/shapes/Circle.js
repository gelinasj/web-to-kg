import { getPosnWithBounds } from "../auxillary/auxillary.js";
import { Shape } from "./Shape.js";

class Circle extends Shape {
    constructor(top, left, diameter, color, borderColor, dotted=false) {
        super();
        this.top = top;
        this.left = left;
        this.diameter = diameter;
        this.color = color;
        this.borderColor = borderColor;
        this.dotted = dotted;
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
        return {
            top: {x:this.left+this.radius, y:this.top},
            bottom: {x:this.left+this.radius, y:this.top+this.diameter},
            left: {x:this.left, y:this.top+this.radius},
            right: {x:this.left+this.diameter, y:this.top+this.radius}
        };
    }

    draw(ctx, text) {
        const lineCount = 5;
        const { x, y } = this.center;
        if(this.dotted) {
            for(let angle = 0; angle < 2*Math.PI; angle += Math.PI/lineCount) {
                ctx.beginPath();
                ctx.arc(x, y, this.radius, angle, angle + Math.PI/lineCount/2);
                ctx.closePath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = this.borderColor;
                ctx.stroke();
            }
        } else {
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.borderColor;
            super.handleShadow(ctx);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, 2*Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.shadowColor = 0;
            ctx.shadowBlur = 0;
        }
        if(text) {
          text = text.split(" ");
          ctx.font = "14px Arial";
          ctx.fillStyle = "black";
          const delta = 14;
          text.forEach((word, i) => ctx.fillText(word, x, y + i*delta));
        }
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
