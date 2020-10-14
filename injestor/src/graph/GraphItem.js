
class GraphItem {
    constructor(shape) {
        this.shape = shape;
        this.lastUpdated = 0;
        this.updateTime();
    }

    updateTime() {
        this.lastUpdated = new Date().getTime();
    }

    doDrawConnectors() {
        this.shape.drawConnectors();
    }

    draw(ctx) {
        this.shape.draw(ctx);
    }

    getXOffset(pX) {
        return this.shape.getXOffset(pX);
    }

    getYOffset(pY) {
        return this.shape.getYOffset(pY);
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
    }

    containsPoint(pX, pY) {
        return this.shape.containsPoint(pX, pY);
    }
}

export default GraphItem;
