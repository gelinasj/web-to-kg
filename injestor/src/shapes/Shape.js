import Circle from "./Circle.js";

class Shape {
    constructor() {
        this.drawConnectors = false;
    }

    shouldDrawConnectors() {
        this.drawConnectors = true;
    }

    draw(ctx) {
        if (this.drawConnectors) {
            this.connectors.forEach(([x,y]) => {
                const connectorRadius = 2;
                new Circle(y - connectorRadius, x - connectorRadius,
                    connectorRadius*2, "black", "black").draw(ctx);
            });
        }
    }
}

export default Shape;
