import { createLine, lineContainsPoint, getPosnWithBounds } from "../auxillary/auxillary.js";
import { Shape } from "./Shape.js";

class Arrow extends Shape {
    constructor(width, startX, startY, endX, endY, color, borderColor) {
        super();
        this.width = width;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.borderColor = borderColor;
        this.tailWidth = this.width/6;
        this.headlength = 20;
        this.translateStartBounds = this.translateStartBounds.bind(this)
        this.translateEndBounds = this.translateEndBounds.bind(this)
    }

    clone() {
      let clone = new Arrow(this.width, this.startX, this.startY, this.endX, this.endY, this.color, this.borderColor);
      super.clone(clone);
      return clone;
    }

    get dx() {
        return this.endX - this.startX;
    }

    get dy() {
        return this.endY - this.startY;
    }

    get arrowAngle() {
        return -1 * Math.atan2(this.dy, this.dx);
    }

    get arrowAngleCompl() {
        return (Math.PI/2) - this.arrowAngle;
    }

    get headBottomPoint() {
        const x = this.endX - this.headlength * Math.cos(this.arrowAngle)
        const y = this.endY + this.headlength * Math.sin(this.arrowAngle)
        return { x, y };
    }

    get wingPoints() {
        const { x:headBottomX , y:headBottomY } = this.headBottomPoint;
        const wingDx = (this.width/2) * Math.cos(this.arrowAngleCompl);
        const wingDy = (this.width/2) * Math.sin(this.arrowAngleCompl);
        const rightWingX = headBottomX + wingDx;
        const rightWingY = headBottomY + wingDy;
        const leftWingX = headBottomX - wingDx;
        const leftWingY = headBottomY - wingDy;
        return {
            rightWing: { x:rightWingX, y:rightWingY },
            leftWing: { x:leftWingX, y:leftWingY },
        };
    }

    get bodyPoints() {
        const { x:headBottomX , y:headBottomY } = this.headBottomPoint;
        const tailCornerDx = this.tailWidth * Math.cos(this.arrowAngleCompl);
        const tailCornerDy = this.tailWidth * Math.sin(this.arrowAngleCompl);
        const tailBottomRightX = this.startX + tailCornerDx;
        const tailBottomRightY = this.startY + tailCornerDy;
        const tailBottomLeftX = this.startX - tailCornerDx;
        const tailBottomLeftY = this.startY - tailCornerDy;
        const tailTopRightX = headBottomX + tailCornerDx;
        const tailTopRightY = headBottomY + tailCornerDy;
        const tailTopLeftX = headBottomX - tailCornerDx;
        const tailTopLeftY = headBottomY - tailCornerDy;
        return {
            br: { x:tailBottomRightX, y:tailBottomRightY },
            bl: { x:tailBottomLeftX, y:tailBottomLeftY },
            tr: { x:tailTopRightX, y:tailTopRightY },
            tl: { x:tailTopLeftX, y:tailTopLeftY }
        };
    }

    get connectors() {
        return {
            start: {x:this.startX, y:this.startY},
            end: {x:this.endX, y:this.endY},
            center: {x:(this.endX-this.startX)/2 + this.startX, y:(this.endY-this.startY)/2 + this.startY}
        };
    }

    get resizers() {
        return {
            start: {x:this.startX, y:this.startY},
            end: {x:this.endX, y:this.endY}
        };
    }

    getClickedResizer(mouseX, mouseY) {
        return Object.entries(this.resizers).find(([id, {x,y}]) => {
            return super.createConnector(x, y).containsPoint(mouseX, mouseY);
        });
    }

    draw(ctx, text) {
        const {
            rightWing: { x:rightWingX , y:rightWingY },
            leftWing: { x:leftWingX , y:leftWingY },
        } = this.wingPoints;
        const {
            br: { x:tailBottomRightX, y:tailBottomRightY },
            bl: { x:tailBottomLeftX, y:tailBottomLeftY },
            tr: { x:tailTopRightX, y:tailTopRightY },
            tl: { x:tailTopLeftX, y:tailTopLeftY }
        } = this.bodyPoints;
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        super.handleShadow(ctx);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(tailBottomRightX, tailBottomRightY);
        ctx.lineTo(tailBottomLeftX, tailBottomLeftY);
        ctx.lineTo(tailTopLeftX, tailTopLeftY);
        ctx.lineTo(leftWingX, leftWingY);
        ctx.lineTo(this.endX, this.endY);
        ctx.lineTo(rightWingX, rightWingY);
        ctx.lineTo(tailTopRightX, tailTopRightY);
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
          const { x, y } = this.connectors.center;
          text.forEach((word, i) => ctx.fillText(word, x, y + i*delta));
        }
        super.draw(ctx);
    }

    headContainsPoint(pX, pY) {
        const {
            rightWing: { x:rightWingX , y:rightWingY },
            leftWing: { x:leftWingX , y:leftWingY },
        } = this.wingPoints;
        const bt = createLine(rightWingX, rightWingY, leftWingX, leftWingY);
        const rt = createLine(this.endX, this.endY, rightWingX, rightWingY);
        const lt = createLine(this.endX, this.endY, leftWingX, leftWingY);
        return lineContainsPoint(bt, this.endX, this.endY, leftWingX, pX, pY) &&
            lineContainsPoint(rt, this.startX, this.startY, this.endX, pX, pY) &&
            lineContainsPoint(lt, this.startX, this.startY, this.endX, pX, pY);
    }

    tailContainsPoint(pX, pY) {
        const {
            br: { x:tailBottomRightX, y:tailBottomRightY },
            bl: { x:tailBottomLeftX, y:tailBottomLeftY },
            tr: { x:tailTopRightX, y:tailTopRightY },
            tl: { x:tailTopLeftX, y:tailTopLeftY }
        } = this.bodyPoints;
        const blBr = createLine(tailBottomRightX, tailBottomRightY,
                tailBottomLeftX, tailBottomLeftY);
        const brTr = createLine(tailBottomRightX, tailBottomRightY,
            tailTopRightX, tailTopRightY);
        const trTl = createLine(tailTopRightX, tailTopRightY,
            tailTopLeftX, tailTopLeftY);
        const tlBl = createLine(tailTopLeftX, tailTopLeftY,
            tailBottomLeftX, tailBottomLeftY);
        return lineContainsPoint(blBr, this.endX, this.endY, tailBottomLeftX, pX, pY) &&
            lineContainsPoint(brTr, this.endX, this.endY, tailBottomRightX, pX, pY) &&
            lineContainsPoint(trTl, this.startX, this.startY, tailTopRightX, pX, pY) &&
            lineContainsPoint(tlBl, this.endX, this.endY, tailTopLeftX, pX, pY);
    }

    containsPoint(pX, pY) {
        return this.headContainsPoint(pX, pY) || this.tailContainsPoint(pX, pY);
    }

    getXOffset(pX) {
        return pX - this.startX;
    }

    getYOffset(pY) {
        return pY - this.startY;
    }

    translateStart(xChange, yChange) {
        this.startX += xChange;
        this.startY += yChange;
    }

    translateEnd(xChange, yChange) {
        this.endX += xChange;
        this.endY += yChange;
    }

    translateArrow(xChange, yChange) {
        this.translateStart(xChange, yChange);
        this.translateEnd(xChange, yChange);
    }

    get points() {
        const pointsObj = { ...this.wingPoints, ...this.bodyPoints, tp:{x:this.endX, y:this.endY} };
        return Object.values(pointsObj).map((pointObj) => [pointObj.x, pointObj.y]);
    }

    get boundingBox() {
        const left = Math.min(...this.points.map(([x,y]) => x));
        const right = Math.max(...this.points.map(([x,y]) => x));
        const top = Math.min(...this.points.map(([x,y]) => y));
        const bottom = Math.max(...this.points.map(([x,y]) => y));
        return { left, right, top, bottom };
    }

    translateStartBounds(x, y, bounds) {
        const { minX, maxX, minY, maxY } = bounds;
        const xChange = getPosnWithBounds(x, minX, maxX) - this.startX;
        const yChange = getPosnWithBounds(y, minY, maxY) - this.startY;
        this.translateStart(xChange, yChange);
    }

    translateEndBounds(x, y, bounds) {
        const { minX, maxX, minY, maxY } = bounds;
        const xChange = getPosnWithBounds(x - this.startX + this.endX, minX, maxX, true) - this.endX;
        const yChange = getPosnWithBounds(y - this.startY + this.endY, minY, maxY) - this.endY;
        this.translateEnd(xChange, yChange);
    }

    setLocation(x, y, optional={}) {
        const { left, right, top, bottom } = this.boundingBox;
        const tmpArrow = new Arrow(this.width, this.startX, this.startY,
            this.endX, this.endY, this.color, this.borderColor);
        tmpArrow.translateArrow(x - this.startX, y - this.startY);
        const { left:leftNew, top:topNew } = tmpArrow.boundingBox;
        const { minX, maxX, minY, maxY } = optional;
        const leftMaxX = maxX === undefined ? maxX : maxX - (right - left);
        const topMaxY = maxY === undefined ? maxY : maxY - (bottom - top);
        const xChange = getPosnWithBounds(leftNew, minX, leftMaxX) - left;
        const yChange = getPosnWithBounds(topNew, minY, topMaxY) - top;
        this.translateArrow(xChange, yChange);
    }

    resize(resizerId, x, y, optional={}) {
        const resizeFn = resizerId === "start" ? this.translateStartBounds : this.translateEndBounds;
        resizeFn(x, y, optional);
    }
}

export default Arrow;
