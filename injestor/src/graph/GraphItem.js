
class GraphItem {
    constructor(shape) {
        this.shape = shape;
        this.lastUpdated = 0;
        this.updateTime();
    }

    updateTime() {
        this.lastUpdated = new Date().getTime();
    }

    shouldDrawConnectors() {
        this.shape.shouldDrawConnectors();
    }

    draw(ctx) {
        this.shape.draw(ctx);
    }

    resize(resizerId, pX, pY, bounds) {
        this.shape.resize(resizerId, pX, pY, bounds);
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

    isResizable() {
        return false;
    }

    getClickedResizer(pX, pY) {
        return this.shape.getClickedResizer(pX, pY);
    }

    get connectors() {
        return this.shape.connectors;
    }

    focus() {
        this.shape.focus();
    }

    unfocus() {
        this.shape.unfocus();
    }
}

export default GraphItem;
