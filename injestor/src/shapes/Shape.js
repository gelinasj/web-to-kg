import Circle from "./Circle.js";

const TO = 1;
const FROM = 2;

class Shape {
    constructor() {
        this.drawConnectors = false;
        this.connectorRadius = 3;
        this.shouldShadow = false;
    }

    shouldDrawConnectors() {
        this.drawConnectors = true;
    }

    createConnector(x, y) {
        return new Circle(y - this.connectorRadius, x - this.connectorRadius,
            this.connectorRadius*2, "black", "black");
    }

    focus() {
        this.shouldShadow = true;
    }

    unfocus() {
        this.shouldShadow = false;
    }

    draw(ctx) {
        if (this.drawConnectors) {
            Object.values(this.connectors).forEach(function({x,y}) {
                this.createConnector(x, y).draw(ctx);
            }.bind(this));
        }
    }
}

export { Shape, TO, FROM };
