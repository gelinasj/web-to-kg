class Rect {
    constructor(top, left, width, height, color) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, this.top, this.width, this.height);
    }

    containsPoint(pX, pY) {
        return ((pX >= this.left) && (pX <= this.left + this.width)) &&
        ((pY >= this.top) && (pY <= this.top + this.height));
    }
}

export default Rect;
