import GraphItem from "./GraphItem.js";
import Arrow from "../shapes/Arrow.js";

class Connection extends GraphItem {
    constructor(width, startX, startY, endX, endY, color, borderColor) {
        super(new Arrow(width, startX, startY, endX, endY, color, borderColor));
        this.to = null;
        this.from = null;
        this.qualifiers = [];
    }

    setLocation(canvasX, canvasY, pX, pY, optional={}) {
        this.updateTime();
        if(this.to === null && this.from === null) {
            this.shape.setLocation(canvasX, canvasY, pX, pY, optional);
            const {x, y} = this.connectors["center"];
            this.qualifiers.forEach((qualifier) => {
                qualifier.resize("start", x, y, undefined, true);
            });
        }
    }

    resize(resizerId, pX, pY, bounds, indirect=false) {
        this.updateTime();
        if(this[resizerId === "start" ? "from" : "to"] === null || indirect) {
            this.shape.resize(resizerId, pX, pY, bounds);
            const {x, y} = this.connectors["center"];
            this.qualifiers.forEach((qualifier) => {
                qualifier.resize("start", x, y, undefined, true);
            });
        }
    }

    isResizable() {
        return true;
    }

    join(that, thisConnector, thatConnector, mutate=true) {
        return that.joinConnection(this, thatConnector, thisConnector, mutate);
    }

    joinLiteral(literal, thisConnector, literalConnector, mutate) {
        return super.joinLiteralAndConnection(literal, this, literalConnector, thisConnector, mutate);
    }

    joinEnity(entity, thisConnector, entityConnector, mutate) {
        return super.joinEnityAndConnection(entity, this, entityConnector, thisConnector, mutate);
    }

    joinConnection(thatConnection, thisConnector, thatConnector, mutate=true) {
        if(thisConnector === "center" && thatConnector === "start") {
            return super.joinConnectionAndConnection(this, thatConnection, mutate);
        } else if(thatConnector === "center" && thisConnector === "start") {
            return super.joinConnectionAndConnection(thatConnection, this, mutate);
        } else {
            return false;
        }
    }
}

export default Connection;
