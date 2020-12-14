import Circle from "./Circle.js";

const TO = 1;
const FROM = 2;

class Shape {
    constructor() {
        this.drawConnectors = false;
        this.connectorRadius = 3;
        this.shouldShadow = false;
        this.backgroundFocus = false;
    }

    clone(clone) {
      clone.drawConnectors = this.drawConnectors;
      clone.connectorRadius = this.connectorRadius;
      clone.shouldShadow = this.shouldShadow;
      clone.backgroundFocus = this.backgroundFocus;
    }

    shouldDrawConnectors() {
        this.drawConnectors = true;
    }

    handleShadow(ctx) {
        if(this.shouldShadow) {
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 8;
        } else if (this.backgroundFocus) {
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 5;
        }
    }

    createConnector(x, y) {
        return new Circle(y - this.connectorRadius, x - this.connectorRadius,
            this.connectorRadius*2, "black", "black");
    }

    focus(backgroundFocus) {
        if(backgroundFocus) {
            this.backgroundFocus = true;
        } else {
            this.shouldShadow = true;
        }
    }

    unfocus(backgroundFocus) {
        if(backgroundFocus) {
            this.backgroundFocus = false;
        } else {
            this.shouldShadow = false;
        }
    }

    draw(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        if (this.drawConnectors) {
            Object.values(this.connectors).forEach(function({x,y}) {
                this.createConnector(x, y).draw(ctx);
            }.bind(this));
        }
    }
}

export { Shape, TO, FROM };
