import GraphItem from "./GraphItem.js";
import Rect from "../shapes/Rect.js";

class Literal extends GraphItem {
    constructor(top, left, width, height, color, borderColor) {
        super(new Rect(top, left, width, height, color, borderColor));
        this.connectedItem = null;
        this.connector = null;
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
        if(this.connectedItem !== null) {
            const {x:xOffset, y:yOffset} = this.connectedItem.resizers["end"];
            const {x, y} = this.connectors[this.connector];
            this.connectedItem.resize("end", x - this.connectedItem.getXOffset(xOffset), y - this.connectedItem.getYOffset(yOffset), undefined, true);
        }
    }

    join(that, thisConnector, thatConnector, mutate=true) {
        return that.joinLiteral(this, thatConnector, thisConnector, mutate);
    }

    joinConnection(connection, thisConnector, connectionConnector, mutate) {
        return super.joinLiteralAndConnection(this, connection, thisConnector, connectionConnector, mutate);
    }
}

export default Literal;
