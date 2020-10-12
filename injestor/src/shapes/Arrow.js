import { createLine, lineContainsPoint, getPosnWithBounds } from "../auxillary.js";

class Arrow {
    constructor(width, startX, startY, endX, endY, color, borderColor) {
        this.width = width;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.borderColor = borderColor;
        this.headlength = 30;
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
        const tailCornerDx = (this.width/6) * Math.cos(this.arrowAngleCompl);
        const tailCornerDy = (this.width/6) * Math.sin(this.arrowAngleCompl);
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

    draw(ctx) {
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
        ctx.beginPath();
        ctx.moveTo(tailBottomRightX, tailBottomRightY);
        ctx.lineTo(tailBottomLeftX, tailBottomLeftY);
        ctx.lineTo(tailTopLeftX, tailTopLeftY);
        ctx.lineTo(leftWingX, leftWingY);
        ctx.lineTo(this.endX, this.endY);
        ctx.lineTo(rightWingX, rightWingY);
        ctx.lineTo(tailTopRightX, tailTopRightY);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    headContainsPoint(pX, pY) {
        const {
            rightWing: { x:rightWingX , y:rightWingY },
            leftWing: { x:leftWingX , y:leftWingY },
        } = this.wingPoints;
        const bt = createLine(rightWingX, rightWingY, leftWingX, leftWingY);
        const rt = createLine(this.endX, this.endY, rightWingX, rightWingY);
        const lt = createLine(this.endX, this.endY, leftWingX, leftWingY);
        return lineContainsPoint(bt, this.startX, this.startY, leftWingX, false, pX, pY) &&
            lineContainsPoint(rt, this.startX, this.startY, this.endX, true, pX, pY) &&
            lineContainsPoint(lt, this.startX, this.startY, this.endX, true, pX, pY);
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
        return lineContainsPoint(blBr, this.endX, this.endY, tailBottomLeftX, true, pX, pY) &&
            lineContainsPoint(brTr, this.endX, this.endY, tailBottomRightX, true, pX, pY) &&
            lineContainsPoint(trTl, this.endX, this.endY, tailTopRightX, false, pX, pY) &&
            lineContainsPoint(tlBl, this.endX, this.endY, tailTopLeftX, true, pX, pY);
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

    setLocation(x, y, optional={}) {
        x = getPosnWithBounds(x, optional.minX, optional.maxX);
        y = getPosnWithBounds(y, optional.minY, optional.maxY);
        const xChange = x - this.startX;
        const yChange = y - this.startY;
        this.startX = x;
        this.startY = y;
        this.endX += xChange;
        this.endY += yChange;
    }
}

export default Arrow;
